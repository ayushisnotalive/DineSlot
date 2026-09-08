import type { Request, Response } from "express";
import crypto from "crypto";
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
        // NOTE: role is intentionally ignored here even if the schema still
        // accepts it in the request body. Every signup becomes 'customer'.
        // Owners are promoted by an admin via /api/admin/promote.
        // (Tighten registerSchema separately to drop `role` from input entirely.)

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
                name, email, mobile_no, password_hash, role
            )
            VALUES ($1, $2, $3, $4, 'customer')
            RETURNING id, name, email, mobile_no, role, created_at;
            `,
            [name, email, mobile_no, passwordHash]
        );

        const user = result.rows[0];

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = hashRefreshToken(refreshToken);
        const csrfToken = crypto.randomBytes(32).toString("hex");

        await db.query(
            `
            INSERT INTO booking.refresh_sessions (user_id, token_hash, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '7 days')
            `,
            [user.id, refreshTokenHash]
        );

        // Refresh token: HttpOnly, scoped to auth endpoints only. JS never sees it.
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/api/auth",
        });

        // CSRF token: NOT HttpOnly — frontend reads it and echoes it back
        // as a header on /refresh and /logout, proving the request came
        // from same-origin JS and not a cross-site form/img/fetch.
        res.cookie("csrfToken", csrfToken, {
            httpOnly: false,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/api/auth",
        });

        // Access token: JSON only. Frontend keeps it in memory, never storage.
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