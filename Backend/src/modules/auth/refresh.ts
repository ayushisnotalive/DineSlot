import type { Request, Response } from "express";
import { db } from "../../infrastructure/DB/db";
import { generateAccessToken } from "../../infrastructure/services/jwt";
import {
    generateRefreshToken,
    hashRefreshToken,
} from "../../infrastructure/services/refreshToken";

export const refreshRotation = async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No refresh token provided",
        });
    }

    const client = await db.connect();

    try {
        await client.query("BEGIN");

        // 1. Hash the refresh token received from the cookie
        const tokenHash = hashRefreshToken(token);

        // 2. Find the refresh session
        const result = await client.query(
            `
            SELECT id, user_id, expires_at, revoked_at
            FROM booking.refresh_sessions
            WHERE token_hash = $1
            FOR UPDATE
            `,
            [tokenHash]
        );

        // 3. Token doesn't exist
        if (result.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        const session = result.rows[0];

        // 4. Token has already been revoked
        if (session.revoked_at) {
            await client.query("ROLLBACK");

            return res.status(401).json({
                success: false,
                message: "Refresh token has been revoked",
            });
        }

        // 5. Token has expired
        if (new Date(session.expires_at) <= new Date()) {
            await client.query("ROLLBACK");

            return res.status(401).json({
                success: false,
                message: "Refresh token has expired",
            });
        }

        // 6. Generate new tokens
        const newRefreshToken = generateRefreshToken();
        const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

        const newAccessToken = generateAccessToken(session.user_id);

        // 7. Revoke old refresh session
        const revokeResult = await client.query(
            `
            UPDATE booking.refresh_sessions
            SET revoked_at = NOW()
            WHERE id = $1
              AND revoked_at IS NULL
            `,
            [session.id]
        );

        if (revokeResult.rowCount !== 1) {
            throw new Error("Failed to revoke refresh session");
        }

        // 8. Create new refresh session
        await client.query(
            `
            INSERT INTO booking.refresh_sessions
                (user_id, token_hash, expires_at)
            VALUES
                ($1, $2, NOW() + INTERVAL '7 days')
            `,
            [session.user_id, newRefreshTokenHash]
        );

        // 9. Everything succeeded
        await client.query("COMMIT");

        // 10. Send new cookies
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "Tokens refreshed successfully",
        });

    } catch (err) {
        await client.query("ROLLBACK");

        console.error("Refresh token rotation error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    } finally {
        client.release();
    }
};