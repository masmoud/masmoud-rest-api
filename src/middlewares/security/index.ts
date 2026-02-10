import { helmetMiddleware } from "./helmet";
import { corsMiddleware } from "./cors";
import { globalRateLimiter } from "./rate-limit";

export const securityMiddleware = [
  helmetMiddleware,
  corsMiddleware,
  globalRateLimiter,
];
