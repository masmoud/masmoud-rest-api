import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  quiet: process.env.NODE_ENV === "test",
});

// Helpers
const parseList = (value: string) => value.split(",").map((v) => v.trim());

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Schemas
const portSchema = z.coerce.number().int().min(1).max(65535);

const urlSchema = z.url().refine(isValidUrl, "Must be a valid URL");

const commaSeparatedUrls = z
  .string()
  .nonempty("ALLOWED_ORIGINS is required")
  .transform(parseList)
  .refine(
    (urls) => urls.every(isValidUrl),
    "ALLOWED_ORIGINS must be a comma-separated list of valid URLs",
  );

const adminUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const adminUsersSchema = z
  .string()
  .nonempty("ADMIN_USERS is required")
  .transform((value, ctx) => {
    try {
      return JSON.parse(value);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "ADMIN_USERS must be valid JSON",
      });
      return z.NEVER;
    }
  })
  .pipe(z.array(adminUserSchema));

// Enums
export enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

// Root environment schema
const envSchema = z.object({
  NODE_ENV: z.enum(Object.values(NodeEnv)).default(NodeEnv.DEVELOPMENT),
  PORT: portSchema.default(3000),
  BASE_URL: urlSchema,
  MONGO_URI: z.string().nonempty("MONGO_URI is required"),
  JWT_ACCESS: z.string().min(32, "JWT_ACCESS must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH: z.string().min(32, "JWT_REFRESH must be at least 32 characters"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  ADMIN_USERS: adminUsersSchema,
  ALLOWED_ORIGINS: commaSeparatedUrls,
  LOG_LEVEL: z.string().default("info"),
});

// Parse and validate environment variables.
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map(
    (i) => `${i.path.join(".")}: ${i.message}`,
  );

  if (process.env.NODE_ENV === "test") {
    throw new Error("Invalid env configuration:\n" + issues);
  }

  console.error("Invalid environment variables:\n" + issues.join("\n"));
  process.exit(1);
}

const data = parsedEnv.data;

// Auth configuration
const authConfig = {
  adminUsers: data.ADMIN_USERS,
} as const;

// Server configuration
const serverConfig = {
  nodeEnv: data.NODE_ENV as NodeEnv,
  isProd: data.NODE_ENV === NodeEnv.PRODUCTION,
  port: data.PORT,
  baseUrl: data.BASE_URL || `http://localhost:${data.PORT}`,
} as const;

// Database configuration
const dbConfig = {
  mongoUri: data.MONGO_URI,
} as const;

// JWT configuration
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

// CORS configuration
const corsConfig = {
  allowedOrigins: data.ALLOWED_ORIGINS,
} as const;

// Logger configuration
const winstonConfig = {
  logLevel: data.LOG_LEVEL,
} as const;

// Export validated configuration.
export const config: Readonly<{
  auth: typeof authConfig;
  server: typeof serverConfig;
  db: typeof dbConfig;
  jwt: typeof jwtConfig;
  cors: typeof corsConfig;
  logger: typeof winstonConfig;
}> = {
  auth: authConfig,
  server: serverConfig,
  db: dbConfig,
  jwt: jwtConfig,
  cors: corsConfig,
  logger: winstonConfig,
};
