// src/common/logger/pinoLogger.ts
import { config } from "@/config";
import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

// Base Logger
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
          // levelFirst: true,
          messageFormat: "{service}{reqId} {msg}",
        },
      }
    : undefined,
});

// Child logger with service name and optional requestId
const createChildLogger = (service: string, requestId?: string) => {
  return baseLogger.child({
    service,
    reqId: requestId ? `[${requestId}]` : "",
  });
};

// Child Loggers
export const logs = Object.freeze({
  main: baseLogger,
  server: createChildLogger("SERVER"),
  http: createChildLogger("HTTP"),
  db: createChildLogger("DB"),
  auth: createChildLogger("AUTH"),
  error: createChildLogger("ERROR"),
  // Optional helper for dynamic child per request
  child: createChildLogger,
});
