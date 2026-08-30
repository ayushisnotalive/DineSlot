import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";

export const cancelMyBooking = async(req:AuthRequest, res:Response)=>{

    const {id} = req.params // booking id from URL, e.g. PATCH /bookings/:id/cancel
    try{
        const bookingcheck = await db.query(
            `SELECT b.id, b.user_id, r.restaurant_id, rt.owner_id
       FROM booking.bookings b
       JOIN booking.resources r ON b.resource_id = r.id
       JOIN booking.restaurants rt ON r.restaurant_id = rt.id
       WHERE b.id = $1`,
       [id]
        );

        if(bookingcheck.rows.length===0){
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        const booking = bookingcheck.rows[0];

        const isCustomer = booking.user_id === req.userId;
        const isRestaurantOwner = booking.owner_id === req.userId;
        if (!isCustomer && !isRestaurantOwner) {
                return res.status(403).json({ success: false, message: "Not authorized to cancel this booking." });
            }

        const result = await db.query(
        `UPDATE booking.bookings SET status = 'cancelled' WHERE id = $1 RETURNING id, status`,
        [id]
        );

        return res.status(200).json({ success: true, booking: result.rows[0] });
    } 
    catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }   
    };