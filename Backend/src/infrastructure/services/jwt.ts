import jwt from "jsonwebtoken"
import { env } from "../configs/env";

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}


export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
}

