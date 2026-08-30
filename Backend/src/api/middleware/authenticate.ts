import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { env } from "../../infrastructure/configs/env";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const decoded = Jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid or expired access token" });
  }
};