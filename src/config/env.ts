import dotenv from "dotenv";
import { z } from "zod";
import { logger } from "./logger";

dotenv.config();

enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

const envSchema = z.object({
  NODE_ENV: z.enum(Object.values(NodeEnv)).default(NodeEnv.DEVELOPMENT),
  PORT: z
    .string()
    .refine(
      (port) => parseInt(port) > 0 && parseInt(port) < 65536,
      "Invalid port number",
    )
    .default("5000"),
  BASE_URL: z
    .string()
    .refine(
      (url) => url.startsWith("http") || url.startsWith("https"),
      "Invalid URL format",
    ),
  MONGO_URI: z.string().nonempty("MONGO_URI is required"),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  ALLOWED_ORIGINS: z.string().nonempty(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
  logger.error("Invalid environment variables:", { issues });
  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  ALLOWED_ORIGINS: parsedEnv.data.ALLOWED_ORIGINS.split(","),
};

export const BASE_URL = env.BASE_URL || `http://localhost:${env.PORT || 5000}`;
