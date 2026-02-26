import { config } from "@/config/env.config";
import { TokenPayload } from "@/modules/auth";
import jwt from "jsonwebtoken";
import { errors } from "./errors.utils";

/**
 * Verifies access token
 */
const verifyAccessToken = (token: string): TokenPayload => {
  const payload = jwt.verify(token, config.jwt.access.secret) as TokenPayload;

  if (!payload.sub) {
    throw errors.Unauthorized("Invalid access token payload");
  }

  return payload;
};

// --- Verify refresh token ---
const verifyRefreshToken = (token: string): TokenPayload => {
  const payload = jwt.verify(token, config.jwt.refresh.secret) as TokenPayload;

  if (!payload.sub) {
    throw errors.Unauthorized("Invalid refresh token payload");
  }

  return payload;
};

export const jwtService = Object.freeze({
  verify: Object.freeze({
    access: (token: string): TokenPayload => verifyAccessToken(token),
    refresh: (token: string): TokenPayload => verifyRefreshToken(token),
  } as const),
} as const);
