import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// --- Helpers ---
const parseList = (value: string) => value.split(",").map((v) => v.trim());

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isValidJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error("ADMIN_USERS must be valid JSON");
  }
};

const isValidEmail = (value: string) => z.email().safeParse(value).success;

// --- Schemas ---
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
      return z.NEVER; // Parsing failed
    }
  })
  .pipe(z.array(adminUserSchema));

// --- Enums ---
export enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

// --- Admin users zod schema ---

// --- Zod schema ---
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

// --- Auth config ---
const authConfig = {
  adminUsers: data.ADMIN_USERS,
} as const;

// --- Server config ---
const serverConfig = {
  nodeEnv: data.NODE_ENV as NodeEnv,
  isProd: data.NODE_ENV === NodeEnv.PRODUCTION,
  port: data.PORT,
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
  allowedOrigins: data.ALLOWED_ORIGINS,
} as const;

// --- Logger config ---
const winstonConfig = {
  logLevel: data.LOG_LEVEL,
} as const;

// --- Export ---
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
