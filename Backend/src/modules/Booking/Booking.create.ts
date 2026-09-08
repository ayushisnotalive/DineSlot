import { db } from "../../infrastructure/DB/db";
import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { createBookingSchema } from "../../infrastructure/services/global_validator";

const EXCLUSION_VIOLATION = "23P01";

export const CreateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.flatten() });
    }

    const { resource_id, start_time, end_time, type_of_table, booking_class } = parsed.data;

    // Cheap early rejection before hitting the DB. The real guarantee
    // is still the DB CHECK + EXCLUDE constraints below.
    if (new Date(start_time) >= new Date(end_time)) {
      return res.status(400).json({ success: false, message: "start_time must be before end_time" });
    }
    if (new Date(start_time) < new Date()) {
      return res.status(400).json({ success: false, message: "start_time cannot be in the past" });
    }

    const insertResult = await db.query(
      `INSERT INTO booking.bookings (user_id, resource_id, start_time, end_time, type_of_table, booking_class, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, start_time, end_time, status`,
      [req.userId, resource_id, start_time, end_time, type_of_table, booking_class]
    );

    return res.status(201).json({ success: true, booking: insertResult.rows[0] });
  } catch (err: any) {
    if (err?.code === EXCLUSION_VIOLATION) {
      return res.status(409).json({ success: false, message: "Table already booked for this time." });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};