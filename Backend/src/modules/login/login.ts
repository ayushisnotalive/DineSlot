import type { Request, Response } from "express";
import { db } from "../../infrastructure/DB/db";
import { verifyPassword } from "../../infrastructure/configs/hashing";
import { loginSchema } from "../../infrastructure/services/auth.validator";
import { env } from "../../infrastructure/configs/env";
import { generateAccessToken, generateRefreshToken } from "../../infrastructure/services/jwt";
import crypto from "crypto"


export const login = async(req:Request, res:Response)=>{
    try {
            const parsed = loginSchema.safeParse(req.body);

            if(!parsed.success){
                return res.status(400).json({
                        success: false,
                        errors: parsed.error.flatten(),
                    });
            }

            const {email,password} = parsed.data;

            const result = await db.query(
                        `SELECT
                            id,
                            name,
                            email,
                            password_hash
                        FROM booking.users
                        WHERE email = $1
                        `,
                        [email]
            )
            
            if (result.rows.length === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password",
                    });
                }

            const user = result.rows[0];

            const isPasswordValid = await verifyPassword(
                user.password_hash,password
            )

            if (!isPasswordValid) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password",
                    });
            }

            const accessToken = generateAccessToken(user.id);

            const csrfToken = crypto.randomBytes(32).toString("hex");

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 15 * 60 * 1000,
            });

            const refreshToken = generateRefreshToken(user.id);
            
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.cookie("csrfToken", csrfToken, {
                httpOnly: false,
                secure: true,
                sameSite: "none",
                maxAge: 15 * 60 * 1000,
            });



            return res.status(200).json({
                success: true,
                message: "User logged in successfully.",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
     }catch(e){
        console.error(e);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
    });
     }
}