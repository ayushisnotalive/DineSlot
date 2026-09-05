import type { Request, Response } from "express";
import { db } from "../../infrastructure/DB/db";

export const getPublicResources = async (req: Request, res: Response) => {
  const { restaurant_id } = req.query;
  try {
    const result = await db.query(
      `SELECT id, name, type_of_table, booking_class FROM booking.resources WHERE restaurant_id = $1`,
      [restaurant_id]
    );
    return res.status(200).json({ success: true, resources: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};