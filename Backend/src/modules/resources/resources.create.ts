import { validateResourcesSchema } from "../../infrastructure/services/global_validator";
import type{Response } from "express";
import type{ AuthRequest } from "../../api/middleware/authenticate";
import { db } from "../../infrastructure/DB/db";



export const CreateResources = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = validateResourcesSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.flatten() });
    }

    const { restaurant_id, name, type_of_table, booking_class } = parsed.data;

    const ownedRestaurant = await db.query(
      `SELECT id FROM booking.restaurants WHERE id = $1 AND owner_id = $2`,
      [restaurant_id, req.userId]
    );

    if (ownedRestaurant.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this restaurant.",
      });
    }

    const result = await db.query(
      `INSERT INTO booking.resources (restaurant_id, name, type_of_table, booking_class)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, type_of_table, booking_class, created_at`,
      [restaurant_id, name, type_of_table, booking_class]
    );

    return res.status(201).json({ success: true, resource: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};