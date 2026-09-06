import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authenticate";
import { db } from "../../infrastructure/DB/db";

export const requireRole = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await db.query(
        `SELECT role FROM booking.users WHERE id = $1`,
        [req.userId]
      );

      if (result.rows.length === 0 || !allowedRoles.includes(result.rows[0].role)) {
        return res.status(403).json({ success: false, message: "Insufficient permissions." });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
};