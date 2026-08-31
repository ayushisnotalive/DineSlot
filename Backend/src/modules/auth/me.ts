import type{ AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";




export const Me = async(req:AuthRequest, res:Response)=>{
    try{
        console.log("DEBUG - req.userId:", req.userId);

        const result = await db.query(
            `SELECT id, name, email FROM booking.users where id=$1`,
            [req.userId]
        );

        console.log("DEBUG - rows found:", result.rows.length);
        if(result.rows.length===0){
             return res.status(401).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};