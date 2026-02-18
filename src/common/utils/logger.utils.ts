import { config, NodeEnv } from "@/config/env.config";
import winston, { format } from "winston";

const { combine, timestamp, printf, colorize } = format;

// --- Log meta info ---
interface LogMeta {
  service?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  durationMs?: number;
  [key: string]: unknown;
}

// --- Level formatter ---
const levelFormat = format((info) => {
  info.level = info.level.toUpperCase().padEnd(5);
  return info;
});

// --- Custom log formatter ---
const logFormat = printf(({ timestamp, level, message, ...meta }: any) => {
  const svc = String(meta.service ?? "APP").padEnd(4);
  if (meta.method && meta.url && typeof meta.statusCode === "number") {
    return `${timestamp} [${level}] [${svc}] ${meta.method} ${meta.url} → ${meta.statusCode} (${meta.durationMs}ms)`;
  }
  return `${timestamp} [${level}] [${svc}] ${message}`;
});

// --- Base format for files ---
const baseFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  levelFormat(),
  logFormat,
);

// ----- DECLARE TRANSPORTS ARRAY -----
const transports: winston.transport[] = [];

// Environment-specific transports
if (config.server.nodeEnv === NodeEnv.PRODUCTION) {
  transports.push(
    new winston.transports.Console({
      format: combine(timestamp(), format.json()),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: baseFormat,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: baseFormat,
    }),
  );
} else if (config.server.nodeEnv === NodeEnv.DEVELOPMENT) {
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
} else if (config.server.nodeEnv === NodeEnv.TEST) {
  // Silent logger for tests
  transports.push(new winston.transports.Console({ silent: true }));
}

// --- Create Logger ---
export const logger = winston.createLogger({
  level: config.logger.logLevel,
  silent: config.server.nodeEnv === "test",
  transports,
});

// Child Loggers per service
export const logs = Object.freeze({
  main: logger,
  http: logger.child({ service: "HTTP" }),
  db: logger.child({ service: "DB" }),
  auth: logger.child({ service: "AUTH" }),
  error: logger.child({ service: "ERROR" }),
});
