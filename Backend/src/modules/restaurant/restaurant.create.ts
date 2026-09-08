import type { Request, Response } from "express";
import { validateRestaurantSchema } from "../../infrastructure/services/global_validator";
import type { AuthRequest } from "../../api/middleware/authenticate";
import { db } from "../../infrastructure/DB/db";

export const CreateRestaurant = async (req: AuthRequest, res: Response) => {
    try {
        const parsed = validateRestaurantSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten() });
        }
        const { name, address, opens_at, closes_at } = parsed.data;

        const result = await db.query(
            `INSERT INTO booking.restaurants (name, owner_id, address, opens_at, closes_at)
            VALUES ($1, $2, $3, COALESCE($4, '09:00'), COALESCE($5, '22:00'))
            RETURNING id, name, address, opens_at, closes_at, created_at`,
            [name, req.userId, address, opens_at ?? null, closes_at ?? null]
        );
        return res.status(201).json({ success: true, restaurant: result.rows[0] });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};