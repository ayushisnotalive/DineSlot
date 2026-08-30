import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";
import { success } from "zod";

export const getResourcesByRestaurant = async (req:AuthRequest, res:Response)=>{
    try{
        const {restaurant_id} = req.query;

        if(!restaurant_id || typeof restaurant_id !== "string"){
            return res.status(400).json({ success: false, message: "restaurant_id is required" });
        }

        // ownership check

        const ownedRestaurant = await db.query(
            `SELECT id FROM booking.users WHERE id = $1 AND owner_id = $2`,
            [restaurant_id, req.userId]
        );

        if((await ownedRestaurant).rows.length ==0){
            res.status(403).json(
                {
                    success:false,
                    message: " Not authorised for this restaurant"
                }
            );

        const result = await db.query(
            `SELECT id , name , type_of_table , booking_class , created_at
            FROM booking.resources WHERE restaurant_id = $ 1 ORDER by created_at DESC`,
            [restaurant_id]
        )
        
        }
    }
    catch(err){
        console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
