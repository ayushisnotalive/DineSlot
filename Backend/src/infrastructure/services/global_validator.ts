import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const validateRestaurantSchema = z.object({
    name: z.string().min(1),
    address: z.string().optional(),
    opens_at: z.string().regex(TIME_REGEX, "opens_at must be in HH:MM format").optional(),
    closes_at: z.string().regex(TIME_REGEX, "closes_at must be in HH:MM format").optional(),
}).refine(
    (data) => {
        if (!data.opens_at || !data.closes_at) return true; // both optional, only check if both given
        return data.opens_at < data.closes_at;
    },
    { message: "opens_at must be before closes_at", path: ["closes_at"] }
);

export const validateResourcesSchema = z.object({
    restaurant_id: z.string().uuid(),
    name: z.string().min(1),
    type_of_table: z.string().min(1).max(100),
    booking_class: z.string().min(1).max(100).optional()
});

export const createBookingSchema = z.object({
  resource_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  type_of_table: z.string().min(1),
  booking_class: z.string().min(1),
})
  .refine(
    (data) => new Date(data.start_time) < new Date(data.end_time),
    { message: "start_time must be before end_time", path: ["end_time"] }
  )
  .refine(
    (data) => {
      const minutesUntilStart = (new Date(data.start_time).getTime() - Date.now()) / 60000;
      return minutesUntilStart >= 30;
    },
    { message: "Bookings require at least 30 minutes' notice", path: ["start_time"] }
  )
  .refine(
    (data) => {
      const daysUntilStart = (new Date(data.start_time).getTime() - Date.now()) / 86400000;
      return daysUntilStart <= 90;
    },
    { message: "Bookings can't be made more than 90 days in advance", path: ["start_time"] }
  )
  .refine(
    (data) => {
      const durationMin = (new Date(data.end_time).getTime() - new Date(data.start_time).getTime()) / 60000;
      return durationMin >= 15 && durationMin <= 240;
    },
    { message: "Booking duration must be between 15 minutes and 4 hours", path: ["end_time"] }
  );

export const promoteSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const setRoleSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum(["customer", "owner", "admin"]),
});