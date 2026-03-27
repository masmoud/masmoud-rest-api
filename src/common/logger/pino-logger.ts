import { config } from "@/config/env.config";
import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

// Base logger configuration.
const baseLogger = pino({
  level: config.logger.logLevel || "info",
  base: { pid: false },
  transport:
    isDev ?
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname,service,reqId",
          messageFormat: "{service}{reqId} {msg}",
        },
      }
    : undefined,
});

// Build child loggers with service name and optional request id.
const createChildLogger = (service: string, requestId?: string) => {
  return baseLogger.child({
    service,
    reqId: requestId ? `[${requestId}]` : "",
  });
};

// Named loggers used across the application.
export const logs = Object.freeze({
  main: baseLogger,
  server: createChildLogger("SERVER"),
  http: createChildLogger("HTTP"),
  db: createChildLogger("DB"),
  auth: createChildLogger("AUTH"),
  error: createChildLogger("ERROR"),
  // Helper for creating dynamic child loggers.
  child: createChildLogger,
});
