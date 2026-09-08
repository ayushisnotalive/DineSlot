import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";
import { z } from "zod";
import { sendEmail, emailTemplates } from "../../infrastructure/services/email";

const paramsSchema = z.object({ id: z.string().uuid() });

export const cancelMyBooking = async (req: AuthRequest, res: Response) => {
  const parsedParams = paramsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ success: false, message: "Invalid booking id" });
  }
  const { id } = parsedParams.data;

  try {
    const result = await db.query(
      `UPDATE booking.bookings b
       SET status = 'cancelled'
       FROM booking.resources r
       JOIN booking.restaurants rt ON rt.id = r.restaurant_id
       JOIN booking.users cust ON cust.id = b.user_id
       JOIN booking.users own ON own.id = rt.owner_id
       WHERE b.id = $1
         AND b.resource_id = r.id
         AND (b.user_id = $2 OR rt.owner_id = $2)
         AND b.status IN ('pending', 'confirmed')
         AND b.start_time > NOW()
       RETURNING b.id, b.status, b.start_time, b.end_time, rt.name AS restaurant_name,
                 b.user_id, rt.owner_id, cust.email AS customer_email, own.email AS owner_email`,
      [id, req.userId]
    );

    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.status(200).json({ success: true, booking: { id: row.id, status: row.status } });

      // Notify whichever party did NOT click cancel.
      const cancelledByCustomer = req.userId === row.user_id;
      const notifyEmail = cancelledByCustomer ? row.owner_email : row.customer_email;
      const template = emailTemplates.bookingCancelled(row.restaurant_name, row.start_time, row.end_time);
      sendEmail({ to: notifyEmail, ...template });
      return;
    }

    const bookingCheck = await db.query(
      `SELECT b.status, b.start_time, b.user_id, rt.owner_id
       FROM booking.bookings b
       JOIN booking.resources r ON b.resource_id = r.id
       JOIN booking.restaurants rt ON r.restaurant_id = rt.id
       WHERE b.id = $1`,
      [id]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    const booking = bookingCheck.rows[0];
    const isCustomer = booking.user_id === req.userId;
    const isRestaurantOwner = booking.owner_id === req.userId;

    if (!isCustomer && !isRestaurantOwner) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this booking." });
    }
    if (booking.status === "cancelled") {
      return res.status(409).json({ success: false, message: "Booking is already cancelled." });
    }
    if (new Date(booking.start_time) <= new Date()) {
      return res.status(409).json({ success: false, message: "Cannot cancel a booking that has already started." });
    }

    return res.status(409).json({ success: false, message: "Booking cannot be cancelled." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};