import type { Response } from "express";
import type { AuthRequest } from "../../api/middleware/authenticate";
import { db } from "../../infrastructure/DB/db";

export const listAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const result = await db.query(
      `SELECT id, name, email, role, created_at
       FROM booking.users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.status(200).json({
      success: true,
      users: result.rows,
      pagination: { limit, offset, count: result.rows.length },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};