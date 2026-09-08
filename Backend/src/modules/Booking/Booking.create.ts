import { db } from "../../infrastructure/DB/db";
import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { createBookingSchema } from "../../infrastructure/services/global_validator";
import { sendEmail, emailTemplates } from "../../infrastructure/services/email";

const EXCLUSION_VIOLATION = "23P01";

export const CreateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.flatten() });
    }

    const { resource_id, start_time, end_time, type_of_table, booking_class } = parsed.data;

    const hoursCheck = await db.query(
      `SELECT rt.opens_at, rt.closes_at, rt.name AS restaurant_name,
              owner.email AS owner_email
       FROM booking.resources r
       JOIN booking.restaurants rt ON rt.id = r.restaurant_id
       JOIN booking.users owner ON owner.id = rt.owner_id
       WHERE r.id = $1`,
      [resource_id]
    );

    if (hoursCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    const { opens_at, closes_at, restaurant_name, owner_email } = hoursCheck.rows[0];
    const startTimeOfDay = new Date(start_time).toTimeString().slice(0, 5);
    const endTimeOfDay = new Date(end_time).toTimeString().slice(0, 5);

    if (startTimeOfDay < opens_at || endTimeOfDay > closes_at) {
      return res.status(400).json({
        success: false,
        message: `This restaurant is only open ${opens_at}–${closes_at}`,
      });
    }

    const insertResult = await db.query(
      `INSERT INTO booking.bookings (user_id, resource_id, start_time, end_time, type_of_table, booking_class, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, start_time, end_time, status`,
      [req.userId, resource_id, start_time, end_time, type_of_table, booking_class]
    );

    const booking = insertResult.rows[0];

    // Response goes out before we bother sending emails — customer
    // shouldn't wait on Resend's round trip.
    res.status(201).json({ success: true, booking });

    const customerResult = await db.query(
      `SELECT name, email FROM booking.users WHERE id = $1`,
      [req.userId]
    );
    const customer = customerResult.rows[0];

    const customerTemplate = emailTemplates.bookingRequestedCustomer(restaurant_name, start_time, end_time);
    sendEmail({ to: customer.email, ...customerTemplate });

    const ownerTemplate = emailTemplates.bookingRequestedOwner(customer.name, start_time, end_time);
    sendEmail({ to: owner_email, ...ownerTemplate });

  } catch (err: any) {
    if (err?.code === EXCLUSION_VIOLATION) {
      return res.status(409).json({ success: false, message: "Table already booked for this time." });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};