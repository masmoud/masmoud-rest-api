import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

// Uppercase + alignment
const levelFormat = winston.format((info) => {
  info.level = info.level.toUpperCase().padEnd(5);
  return info;
});

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

// Base format
const baseFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  levelFormat(),
  logFormat,
);

// Main logger
export const logger = winston.createLogger({
  level: "info",
  transports: [
    // Console (colored)
    new winston.transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        levelFormat(),
        colorize({ all: true }),
        logFormat,
      ),
    }),

    // Error file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: baseFormat,
    }),

    // Combined file
    new winston.transports.File({
      filename: "logs/combined.log",
      format: baseFormat,
    }),
  ],
});

// Child loggers auto-inject service tag
export const httpLogger = logger.child({ service: "HTTP" });
export const dbLogger = logger.child({ service: "DB" });
export const authLogger = logger.child({ service: "AUTH" });
export const errorLogger = logger.child({ service: "ERROR" });
