import rateLimit from "express-rate-limit";
import { serverConfig } from "../../config/env";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: serverConfig.nodeEnv === "production" ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later",
});
