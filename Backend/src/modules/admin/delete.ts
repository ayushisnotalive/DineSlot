import type { AuthRequest } from "../../api/middleware/authenticate";
import type { Response } from "express";
import { db } from "../../infrastructure/DB/db";

export const deleteUser = async (req: AuthRequest, res: Response) => {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
        return res.status(400).json({
            success: false,
            message: "Valid email is required.",
        });
    }

    try {
        const result = await db.query(
            `DELETE FROM booking.users
             WHERE email = $1
             RETURNING id, name, email`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully.",
            user: result.rows[0],
        });
    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};