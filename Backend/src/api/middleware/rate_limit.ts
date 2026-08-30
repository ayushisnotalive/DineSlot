import rateLimit from "express-rate-limit"

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 attempts per window per IP
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,     // adds RateLimit-* headers
  legacyHeaders: false,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,                   // prevent mass account creation
  message: { error: "Too many accounts created from this IP. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,                   // more lenient — legit users hit this often
  message: { error: "Too many refresh attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});