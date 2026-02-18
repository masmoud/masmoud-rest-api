import { corsMiddleware } from "./cors";
import { helmetMiddleware } from "./helmet";
import { globalRateLimiter } from "./rate-limit";

export const securityMiddleware = [
  helmetMiddleware,
  corsMiddleware,
  globalRateLimiter,
];
