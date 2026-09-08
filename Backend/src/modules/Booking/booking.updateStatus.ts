import { db } from "../../infrastructure/DB/db";
import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { z } from "zod";
import { sendEmail, emailTemplates } from "../../infrastructure/services/email";

const paramsSchema = z.object({ id: z.string().uuid() });
const bodySchema = z.object({ action: z.enum(["confirm", "reject"]) });

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const parsedParams = paramsSchema.safeParse(req.params);
    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedParams.success || !parsedBody.success) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    const { id } = parsedParams.data;
    const { action } = parsedBody.data;
    const newStatus = action === "confirm" ? "confirmed" : "cancelled";

    const result = await db.query(
      `UPDATE booking.bookings b
       SET status = $1
       FROM booking.resources r
       JOIN booking.restaurants rt ON rt.id = r.restaurant_id
       JOIN booking.users cust ON cust.id = b.user_id
       WHERE b.id = $2
         AND b.resource_id = r.id
         AND rt.owner_id = $3
         AND b.status = 'pending'
       RETURNING b.id, b.status, b.start_time, b.end_time, rt.name AS restaurant_name,
                 cust.email AS customer_email`,
      [newStatus, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found, not owned by you, or not pending",
      });
    }

    const row = result.rows[0];
    res.status(200).json({ success: true, booking: { id: row.id, status: row.status } });

    const template = action === "confirm"
      ? emailTemplates.bookingConfirmed(row.restaurant_name, row.start_time, row.end_time)
      : emailTemplates.bookingRejected(row.restaurant_name, row.start_time, row.end_time);
    sendEmail({ to: row.customer_email, ...template });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};