import type { Response } from "express";
import type { AuthRequest } from "../../api/middleware/authenticate";
import { db } from "../../infrastructure/DB/db";

export const listAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, created_at FROM booking.users ORDER BY created_at DESC`
    );
    return res.status(200).json({ success: true, users: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};