import type { Request, Response } from "express";
import { db } from "../../infrastructure/DB/db";


export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT id, name, address FROM booking.restaurants ORDER BY created_at DESC`
    );
    return res.status(200).json({ success: true, restaurants: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};