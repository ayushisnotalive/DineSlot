import type { Response } from "express";
import type { AuthRequest } from "../../api/middleware/authenticate";
import { db } from "../../infrastructure/DB/db";

export const setUserRole = async (req: AuthRequest, res: Response) => {
  const { userId, role } = req.body;

  if (!["customer", "owner", "admin"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role." });
  }

  try {
    const result = await db.query(
      `UPDATE booking.users SET role = $1 WHERE id = $2 RETURNING id, name, email, role`,
      [role, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};