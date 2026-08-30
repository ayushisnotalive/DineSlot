import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";

export const getMyBookings = async (req:AuthRequest, res:Response)=>{
    try{
        const result = await db.query(
            `SELECT
                b.id, b.start_time, b.end_time, b.status,
                r.name AS resource_name, r.type_of_table,
                u.name AS user_name
            FROM booking.bookings b
            JOIN booking.resources r ON b.resource_id = r.id
            JOIN booking.users u ON b.user_id = u.id
            WHERE b.user_id = $1
            ORDER BY b.start_time ASC`,
            [req.userId]
    );
        return res.status(200).json({ success: true, bookings: result.rows });
        }
    catch (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
                }
    };