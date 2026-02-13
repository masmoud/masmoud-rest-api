import dotenv from "dotenv";
import { z } from "zod";

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
    .default("3000"),
  BASE_URL: z
    .string()
    .refine(
      (url) => url.startsWith("http") || url.startsWith("https"),
      "Invalid URL format",
    ),
  MONGO_URI: z.string().nonempty("MONGO_URI is required"),
  JWT_ACCESS: z.string().min(32, "JWT_ACCESS must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"), // default to 15 minutes
  JWT_REFRESH: z.string().min(32, "JWT_REFRESH must be at least 32 characters"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"), // default to 7 days
  ALLOWED_ORIGINS: z.string().nonempty(),
  LOG_LEVEL: z.string().default("info"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
  console.error("Invalid environment variables:", { issues });
  process.exit(1);
}

const data = parsedEnv.data;

export const serverConfig = {
  nodeEnv: data.NODE_ENV,
  port: parseInt(data.PORT),
  baseUrl: data.BASE_URL || `http://localhost:${data.PORT}`,
};

export const dbConfig = {
  mongoUri: data.MONGO_URI,
};

export const jwtConfig = {
  access: {
    secret: data.JWT_ACCESS,
    expiresIn: data.JWT_ACCESS_EXPIRES_IN,
  },
  refresh: {
    secret: data.JWT_REFRESH,
    expiresIn: data.JWT_REFRESH_EXPIRES_IN,
  },
};

// CORS config
export const corsConfig = {
  allowedOrigins: data.ALLOWED_ORIGINS.split(","), // array of origins
};

// Winston config
export const winsConfig = {
  logLevel: data.LOG_LEVEL,
};
