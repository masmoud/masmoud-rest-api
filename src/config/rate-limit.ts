import rateLimit from "express-rate-limit";
import { env } from "./env";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === "production" ? 100 : 1000,
  standardHeaders: true, // returns limited info in headers
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later",
});
