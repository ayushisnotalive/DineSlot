import {z} from "zod";

export const validateRestaurantSchema = z.object({
    name: z.string().min(1),
    address : z.string().optional(),
})

export const validateResourcesSchema = z.object({
    restaurant_id : z.string().uuid(),
    name : z.string().min(1),
    type_of_table : z.string().min(1).max(100),
    booking_class : z.string().min(1).max(100).optional()
})


export const createBookingSchema = z.object({
  resource_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  type_of_table: z.string().min(1),
  booking_class: z.string().min(1),
});