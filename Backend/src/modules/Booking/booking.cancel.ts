import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";
import { z } from "zod";

const paramsSchema = z.object({ id: z.string().uuid() });

export const cancelMyBooking = async (req: AuthRequest, res: Response) => {
  const parsedParams = paramsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ success: false, message: "Invalid booking id" });
  }
  const { id } = parsedParams.data;

  try {
    // Single atomic statement: authorization (customer OR restaurant owner),
    // current-status guard, and time-window policy are all enforced in the
    // WHERE clause, so a concurrent cancel/confirm race can't corrupt state.
    const result = await db.query(
      `UPDATE booking.bookings b
       SET status = 'cancelled'
       FROM booking.resources r
       JOIN booking.restaurants rt ON rt.id = r.restaurant_id
       WHERE b.id = $1
         AND b.resource_id = r.id
         AND (b.user_id = $2 OR rt.owner_id = $2)
         AND b.status IN ('pending', 'confirmed')
         AND b.start_time > NOW()
       RETURNING b.id, b.status`,
      [id, req.userId]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({ success: true, booking: result.rows[0] });
    }

    // Zero rows updated — figure out why, to return a useful message
    // instead of a generic 404 for every failure mode.
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