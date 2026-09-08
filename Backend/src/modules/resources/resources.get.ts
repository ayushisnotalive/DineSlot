import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";

export const getResourcesByRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurant_id } = req.query;

    if (!restaurant_id || typeof restaurant_id !== "string") {
      return res.status(400).json({ success: false, message: "restaurant_id is required" });
    }

    // ownership check — must query restaurants, not users
    const ownedRestaurant = await db.query(
      `SELECT id FROM booking.restaurants WHERE id = $1 AND owner_id = $2`,
      [restaurant_id, req.userId]
    );

    if (ownedRestaurant.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Not authorised for this restaurant",
      });
    }

    const result = await db.query(
      `SELECT id, name, type_of_table, booking_class, created_at
       FROM booking.resources
       WHERE restaurant_id = $1
       ORDER BY created_at DESC`,
      [restaurant_id]
    );

    return res.status(200).json({ success: true, resources: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};