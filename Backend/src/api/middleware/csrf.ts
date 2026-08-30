import type { Request, Response, NextFunction } from "express";

export const verifyCsrf = (req: Request, res: Response, next: NextFunction) => {
  const cookieToken = req.cookies?.csrfToken;
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ error: "CSRF token mismatch" });
    return;
  }

  next();
};