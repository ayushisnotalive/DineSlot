import type { Request, Response } from "express";
import crypto from "crypto";
import { db } from "../../infrastructure/DB/db";
import { generateAccessToken } from "../../infrastructure/services/jwt";
import {
    generateRefreshToken,
    hashRefreshToken,
} from "../../infrastructure/services/refreshToken";

export const refreshRotation = async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;
    const csrfCookie = req.cookies?.csrfToken;
    const csrfHeader = req.headers["x-csrf-token"];

    if (!token) {
        return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    // Double-submit CSRF check. The refresh cookie is sent automatically
    // by the browser on any cross-site request to this endpoint; requiring
    // a matching header proves the caller is same-origin JS that could
    // actually read the csrfToken cookie.
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return res.status(403).json({ success: false, message: "Invalid CSRF token" });
    }

    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const tokenHash = hashRefreshToken(token);

        const result = await client.query(
            `
            SELECT id, user_id, expires_at, revoked_at
            FROM booking.refresh_sessions
            WHERE token_hash = $1
            FOR UPDATE
            `,
            [tokenHash]
        );

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(401).json({ success: false, message: "Invalid refresh token" });
        }

        const session = result.rows[0];

        if (session.revoked_at) {
            // TODO once you're ready: this branch is also where refresh-token
            // REUSE is detected (someone presenting an already-rotated token —
            // a signal of theft). For now it just denies; consider revoking
            // the entire session family here later.
            await client.query("ROLLBACK");
            return res.status(401).json({ success: false, message: "Refresh token has been revoked" });
        }

        if (new Date(session.expires_at) <= new Date()) {
            await client.query("ROLLBACK");
            return res.status(401).json({ success: false, message: "Refresh token has expired" });
        }

        const newRefreshToken = generateRefreshToken();
        const newRefreshTokenHash = hashRefreshToken(newRefreshToken);
        const newAccessToken = generateAccessToken(session.user_id);
        const newCsrfToken = crypto.randomBytes(32).toString("hex");

        const revokeResult = await client.query(
            `
            UPDATE booking.refresh_sessions
            SET revoked_at = NOW()
            WHERE id = $1 AND revoked_at IS NULL
            `,
            [session.id]
        );

        if (revokeResult.rowCount !== 1) {
            throw new Error("Failed to revoke refresh session");
        }

        const inserted = await client.query(
            `
            INSERT INTO booking.refresh_sessions (user_id, token_hash, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '7 days')
            RETURNING id
            `,
            [session.user_id, newRefreshTokenHash]
        );

        // Link old -> new so a reuse-detection pass can walk the chain later.
        await client.query(
            `UPDATE booking.refresh_sessions SET replaced_by = $1 WHERE id = $2`,
            [inserted.rows[0].id, session.id]
        );

        await client.query("COMMIT");

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/api/auth",
        });

        res.cookie("csrfToken", newCsrfToken, {
            httpOnly: false,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/api/auth",
        });

        return res.status(200).json({
            success: true,
            message: "Tokens refreshed successfully",
            accessToken: newAccessToken,
        });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Refresh token rotation error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    } finally {
        client.release();
    }
};