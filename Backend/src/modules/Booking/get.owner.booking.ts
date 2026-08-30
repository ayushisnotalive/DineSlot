import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";

export const getOwnerBookings = async (req:AuthRequest, res:Response)=>{
    try{
        const result = db.query(
            `SELECT 
                b.id, b.start_time, b.end_time, b.status,
                r.name AS resource_name, r.type_of_table,
                rt.name AS restaurant_name,
                u.name AS customer_name, u.email AS customer_email
                FROM booking.bookings b
                JOIN booking.resources r ON b.resource_id = r.id
                JOIN booking.restaurants rt ON r.restaurant_id = rt.id
                JOIN booking.users u ON b.user_id = u.id
                WHERE rt.owner_id = $1
                ORDER BY b.start_time ASC`,
                [req.userId]
        );
        return res.status(200).json({ success: true, bookings: (await result).rows });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
        };