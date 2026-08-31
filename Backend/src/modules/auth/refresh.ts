import type { Request,Response } from "express";
import { generateAccessToken, generateRefreshToken,verifyRefreshToken } from "../../infrastructure/services/jwt";
import { env } from "../../infrastructure/configs/env";




export const refreshRotation = async(req:Request, res:Response)=>{
    const token = req.cookies?.refreshToken;

    if(!token){
        return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    try{

        const decoded = verifyRefreshToken(token);
        const newRefreshToken = generateRefreshToken(decoded.userId);

        res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        });

        const newAccessToken = generateAccessToken(decoded.userId);

        res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
        path: "/",
        


    });

    return res.status(200).json({ success: true, message: "Access token refreshed." });
    }
    
    catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
        }
};