import { config } from "@/config/env.config";
import helmet from "helmet";

export const helmetMiddleware = helmet({
  contentSecurityPolicy:
    config.server.nodeEnv === "production" ?
      {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'"],
        },
      }
    : false,
  crossOriginEmbedderPolicy: false,
});
