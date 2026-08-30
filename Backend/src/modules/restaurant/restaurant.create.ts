import type { Request,Response } from "express";
import { validateRestaurantSchema } from "../../infrastructure/services/global_validator";
import type{ AuthRequest} from "../../api/middleware/authenticate";
import { db } from "../../infrastructure/DB/db";

export const CreateRestaurant = async (req:AuthRequest, res:Response)=>{
    try{
        const parsed = validateRestaurantSchema.safeParse(req.body)
        if(!parsed.success){
            return res.status(400).json({ success: false, errors: parsed.error.flatten() });
        }
        const {name , address} = parsed.data;

        const result = await db.query(
        `INSERT INTO booking.restaurants (name, owner_id, address)
        VALUES ($1, $2, $3)
        RETURNING id, name, address, created_at`,
        [name, req.userId, address]
    );
    return res.status(201).json({ success: true, restaurant: result.rows[0] });

  }catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  };

}