import helmet from "helmet";
import { serverConfig } from "../../config/env";

export const helmetMiddleware = helmet({
  contentSecurityPolicy:
    serverConfig.nodeEnv === "production" ?
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
