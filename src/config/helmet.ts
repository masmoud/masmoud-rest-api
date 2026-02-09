import helmet from "helmet";
import { env } from "./env";

// Secure headers + Avoid XSS, clickjacking, injections...
export const helmetConfig = helmet({
  contentSecurityPolicy:
    env.NODE_ENV === "production" ?
      {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'"],
        },
      }
    : false, // CSP more permissive in development
  crossOriginEmbedderPolicy: false,
});
