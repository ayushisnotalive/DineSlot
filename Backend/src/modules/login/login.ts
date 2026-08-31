import type { Request, Response } from "express";
import { db } from "../../infrastructure/DB/db";
import { verifyPassword } from "../../infrastructure/configs/hashing";
import { loginSchema } from "../../infrastructure/services/auth.validator";
import { generateAccessToken } from "../../infrastructure/services/jwt";
import { generateRefreshToken, hashRefreshToken } from "../../infrastructure/services/refreshToken";

export const login = async (req: Request, res: Response) => {
    try {
        const parsed = loginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten(),
            });
        }

        const { email, password } = parsed.data;

        const result = await db.query(
            `SELECT id, name, email, password_hash FROM booking.users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const user = result.rows[0];

        const isPasswordValid = await verifyPassword(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = hashRefreshToken(refreshToken);

        await db.query(
            `
            INSERT INTO booking.refresh_sessions
                (user_id, token_hash, expires_at)
            VALUES
                ($1, $2, NOW() + INTERVAL '7 days')
            `,
            [user.id, refreshTokenHash]
        );

        res.cookie("refreshToken", refreshToken, {
            secure: true,
            sameSite: "none" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        res.cookie("accessToken", accessToken, {
            secure: true,
            sameSite: "none" as const,
            maxAge: 15 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};