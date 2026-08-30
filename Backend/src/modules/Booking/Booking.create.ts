import { db } from "../../infrastructure/DB/db";
import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { createBookingSchema } from "../../infrastructure/services/global_validator";



export const CreateBooking = async(req:AuthRequest, res:Response)=>{
    const client = await db.connect(); //dedicated client , not a direct pool.
    try{
        const parsed = createBookingSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({success:false, errors:parsed.error.flatten()});
        }
        const {resource_id, start_time, end_time, type_of_table, booking_class} = parsed.data

        await client.query("BEGIN");

        const conflictcheck = await client.query(
            `SELECT id FROM booking.bookings
            WHERE resource_id = $1
                AND status !='cancelled'
                AND(start_time, end_time) OVERLAPS ($2, $3)
            FOR UPDATE`,
            [resource_id,start_time,end_time]
        )

        if(conflictcheck.rows.length>0){
            await client.query("ROLLBACK");
            return res.status(409).json({ success: false, message: "Table already booked for this time." });
        };

        const insertResult = await client.query(
            `INSERT INTO booking.bookings (user_id, resource_id, start_time, end_time, type_of_table, booking_class)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id,start_time, end_time, status`,
            [req.userId, resource_id,  start_time, end_time, type_of_table,booking_class]
        );

        await client.query("COMMIT");
        return res.status(201).json({ success: true, booking: insertResult.rows[0] });


    }catch(e){
        await client.query("ROLLBACK");
        console.error(e);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    } finally {
        client.release();
    }
    };