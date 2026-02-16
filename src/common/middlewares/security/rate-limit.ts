import { config } from "@/config/env";
import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.server.nodeEnv === "production" ? 10 : 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again later" },
});
