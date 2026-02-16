import { config } from "@/config/env";
import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

// Uppercase level + alignment
const levelFormat = winston.format((info) => {
  info.level = info.level.toUpperCase().padEnd(5);
  return info;
});

// Custom log formatter
const logFormat = printf((info) => {
  const {
    timestamp,
    level,
    message,
    service,
    method,
    url,
    statusCode,
    durationMs,
  } = info;

  const svc = String(service ?? "APP").padEnd(4);

  if (method && url && typeof statusCode === "number") {
    return `${timestamp} [${level}] [${svc}] ${method} ${url} → ${statusCode} (${durationMs}ms)`;
  }

  return `${timestamp} [${level}] [${svc}] ${message}`;
});

// Base format for files
const baseFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  levelFormat(),
  logFormat,
);

// ----- DECLARE TRANSPORTS ARRAY -----
const transports: winston.transport[] = [];

// Environment-specific transports
if (config.server.nodeEnv === "production") {
  // JSON console logs for log aggregators
  transports.push(
    new winston.transports.Console({
      format: combine(timestamp(), winston.format.json()),
    }),
  );

  // Error file
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: baseFormat,
    }),
  );

  // Combined file
  transports.push(
    new winston.transports.File({
      filename: "logs/combined.log",
      format: baseFormat,
    }),
  );
} else if (config.server.nodeEnv === "development") {
  // Colored console logs for dev
  transports.push(
    new winston.transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        levelFormat(),
        colorize({ all: true }),
        logFormat,
      ),
    }),
  );
} else if (config.server.nodeEnv === "test") {
  // Silent logger for tests
  transports.push(new winston.transports.Console({ silent: true }));
}

// Create Logger
export const logger = winston.createLogger({
  level: config.logger.logLevel,
  silent: config.server.nodeEnv === "test",
  transports,
});

// Child Loggers per service
export const httpLogger = logger.child({ service: "HTTP" });
export const dbLogger = logger.child({ service: "DB" });
export const authLogger = logger.child({ service: "AUTH" });
export const errorLogger = logger.child({ service: "ERROR" });
