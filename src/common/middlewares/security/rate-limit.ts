import { config } from "@/config/env.config";
import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.server.nodeEnv === "production" ? 10 : 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.server.nodeEnv === "production" ? 5 : 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
  },
});
