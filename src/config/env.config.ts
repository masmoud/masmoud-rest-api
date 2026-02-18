import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// --- Enums ---
export enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

// --- Zod schema ---
const envSchema = z.object({
  NODE_ENV: z.enum(Object.values(NodeEnv)).default(NodeEnv.DEVELOPMENT),
  PORT: z
    .string()
    .refine((port) => {
      const num = parseInt(port, 10);
      return Number.isInteger(num) && num > 0 && num < 65536;
    }, "PORT must be a number between 1 and 65535")
    .default("3000"),
  BASE_URL: z.string().refine((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, "BASE_URL must be a valid URL"),
  MONGO_URI: z.string().nonempty("MONGO_URI is required"),
  JWT_ACCESS: z.string().min(32, "JWT_ACCESS must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH: z.string().min(32, "JWT_REFRESH must be at least 32 characters"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  ALLOWED_ORIGINS: z
    .string()
    .nonempty("ALLOWED_ORIGINS is required")
    .refine(
      (val) =>
        val.split(",").every((o) => {
          try {
            new URL(o.trim());
            return true;
          } catch {
            return false;
          }
        }),
      "ALLOWED_ORIGINS must be a comma-separated list of valid URLs",
    ),
  LOG_LEVEL: z.string().default("info"),
});

// --- Parse & validate ---
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map(
    (i) => `${i.path.join(".")}: ${i.message}`,
  );
  console.error("Invalid environment variables:\n" + issues.join("\n"));
  process.exit(1);
}

const data = parsedEnv.data;

// --- Server config ---
const serverConfig = {
  nodeEnv: data.NODE_ENV as NodeEnv,
  isProd: data.NODE_ENV === NodeEnv.PRODUCTION,
  port: parseInt(data.PORT, 10),
  baseUrl: data.BASE_URL || `http://localhost:${data.PORT}`,
} as const;

// --- Database config ---
const dbConfig = {
  mongoUri: data.MONGO_URI,
} as const;

// --- JWT config ---
const jwtConfig = {
  access: {
    secret: data.JWT_ACCESS,
    expiresIn: data.JWT_ACCESS_EXPIRES_IN,
  },
  refresh: {
    secret: data.JWT_REFRESH,
    expiresIn: data.JWT_REFRESH_EXPIRES_IN,
  },
} as const;

// CORS config
const corsConfig = {
  allowedOrigins: data.ALLOWED_ORIGINS.split(",").map((o) => o.trim()),
} as const;

// --- Logger config ---
const winstonConfig = {
  logLevel: data.LOG_LEVEL,
} as const;

// --- Export ---
export const config: Readonly<{
  server: typeof serverConfig;
  db: typeof dbConfig;
  jwt: typeof jwtConfig;
  cors: typeof corsConfig;
  logger: typeof winstonConfig;
}> = {
  server: serverConfig,
  db: dbConfig,
  jwt: jwtConfig,
  cors: corsConfig,
  logger: winstonConfig,
};
