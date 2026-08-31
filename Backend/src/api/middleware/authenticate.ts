import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { env } from "../../infrastructure/configs/env";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated",
        });
    }

    try {
        const decoded = Jwt.verify(
            token,
            env.JWT_ACCESS_SECRET
        ) as { userId: string };

        req.userId = decoded.userId;

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};