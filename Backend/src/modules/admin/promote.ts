import type { Response } from "express";
import type { AuthRequest } from "../../api/middleware/authenticate";
import { db } from "../../infrastructure/DB/db";

export const promoteToOwner = async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    const result = await db.query(
      `UPDATE booking.users SET role = 'owner' WHERE email = $1 RETURNING id, name, email, role`,
      [email]
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