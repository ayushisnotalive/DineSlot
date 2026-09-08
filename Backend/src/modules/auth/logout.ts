import type { Request, Response } from "express";
import { db } from "../../infrastructure/DB/db";
import { hashRefreshToken } from "../../infrastructure/services/refreshToken";

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;

    try {
        if (token) {
            const tokenHash = hashRefreshToken(token);
            await db.query(
                `
                UPDATE booking.refresh_sessions
                SET revoked_at = NOW()
                WHERE token_hash = $1 AND revoked_at IS NULL
                `,
                [tokenHash]
            );
        }
    } catch (err) {
        // Don't block logout on a DB hiccup — cookies still get cleared below.
        console.error("Logout revocation error:", err);
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/api/auth",
    });

    res.clearCookie("csrfToken", {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: "/api/auth",
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};