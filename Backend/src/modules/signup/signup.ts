import crypto from "crypto";
import type { Request, Response } from "express";
import { db } from "../../infrastructure/DB/db";
import { hashedPassword } from "../../infrastructure/configs/hashing";
import { env } from "../../infrastructure/configs/env";
import { registerSchema } from "../../infrastructure/services/auth.validator";
import { generateAccessToken } from "../../infrastructure/services/jwt";

export const signup = async (req: Request, res: Response) => {
    try {
        const parsed = registerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten(),
            });
        }

        const { name, email,mobile_no, password } = parsed.data;

        const existingUser = await db.query(
            `SELECT id FROM booking.users WHERE email = $1`,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email.",
            });
        }

        const passwordHash = await hashedPassword(password);

        const result = await db.query(
            `
            INSERT INTO booking.users (
                name,
                email,
                mobile_no,
                password_hash
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                name,
                email,
                mobile_no,
                created_at;
            `,
            [name, email, mobile_no, passwordHash]
        );

        const user = result.rows[0];

        console.log({ name, email, mobile_no, passwordHash });

        const accessToken = generateAccessToken(user.id);

        const csrfToken = crypto.randomBytes(32).toString("hex");

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
            
        });

        res.cookie("csrfToken", csrfToken, {
            httpOnly: false,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            accessToken,
            user,
        });

        

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


