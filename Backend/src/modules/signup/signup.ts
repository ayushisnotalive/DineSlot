import type { Request, Response } from "express";
import { db } from "../../infrastructure/DB/db";
import { hashedPassword } from "../../infrastructure/configs/hashing";
import { registerSchema } from "../../infrastructure/services/auth.validator";
import { generateAccessToken } from "../../infrastructure/services/jwt";
import {
    generateRefreshToken,
    hashRefreshToken,
} from "../../infrastructure/services/refreshToken";

export const signup = async (req: Request, res: Response) => {
    try {
        const parsed = registerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten(),
            });
        }

        const { name, email, mobile_no, password } = parsed.data;

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

        // Hash password
        const passwordHash = await hashedPassword(password);

        // Create user
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

        // Generate access token
        const accessToken = generateAccessToken(user.id);

        // Generate opaque refresh token
        const refreshToken = generateRefreshToken();

        // Hash refresh token before storing it in DB
        const refreshTokenHash = hashRefreshToken(refreshToken);

        // Store refresh-token session
        await db.query(
            `
            INSERT INTO booking.refresh_sessions (
                user_id,
                token_hash,
                expires_at
            )
            VALUES (
                $1,
                $2,
                NOW() + INTERVAL '7 days'
            )
            `,
            [user.id, refreshTokenHash]
        );

        // Access token cookie
        res.cookie("accessToken", accessToken, {
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
            path: "/",
        });

        // Refresh token cookie
        res.cookie("refreshToken", refreshToken, {
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            accessToken,
            user,
        });

    } catch (err) {
        console.error("Signup error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

