import type{ AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";

export const getMyRestaurant = async(req:AuthRequest, res:Response)=>{
    try{
        const result = await db.query(
            `SELECT id, name, address, created_at
            FROM booking.restaurants
            WHERE owner_id = $1
            ORDER BY created_at DESC`,
            [req.userId]
        );
        return res.status(200).json({ success: true, restaurants: result.rows });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };
