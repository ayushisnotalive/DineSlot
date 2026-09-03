import type{ AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";

export const  restaurantDetails = async(req:AuthRequest, res:Response)=>{
    try{
        const {restaurant_id } = req.query;

    }
    catch(e){
        
    }
}