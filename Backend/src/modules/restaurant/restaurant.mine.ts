import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";

export const getMyRestaurant = async (req: AuthRequest, res: Response) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 20, 100);
        const offset = Math.max(Number(req.query.offset) || 0, 0);

        const result = await db.query(
            `SELECT id, name, address, created_at
            FROM booking.restaurants
            WHERE owner_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3`,
            [req.userId, limit, offset]
        );

        return res.status(200).json({
            success: true,
            restaurants: result.rows,
            pagination: { limit, offset, count: result.rows.length },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};