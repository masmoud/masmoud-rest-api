import { corsConfig } from "../config/cors";
import { helmetConfig } from "../config/helmet";
import { globalRateLimiter } from "../config/rate-limit";

export const securityMiddleware = [helmetConfig, corsConfig, globalRateLimiter];
