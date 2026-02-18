import { config } from "@/config/env.config";
import { AccessTokenPayload, RefreshTokenPayload } from "@/modules/auth";
import jwt from "jsonwebtoken";
import { errors } from "./errors.utils";

/**
 * Verifies access token
 */
const verifyAccessToken = (token: string): AccessTokenPayload => {
  const payload = jwt.verify(
    token,
    config.jwt.access.secret,
  ) as AccessTokenPayload;

  if (!payload.sub || !payload.role) {
    throw errors.Unauthorized("Invalid access token payload");
  }

  return payload;
};

// --- Verify refresh token ---
const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const payload = jwt.verify(
    token,
    config.jwt.refresh.secret,
  ) as RefreshTokenPayload;

  if (!payload.sub) {
    throw errors.Unauthorized("Invalid refresh token payload");
  }

  return payload;
};

export const jwtService = Object.freeze({
  verify: Object.freeze({
    access: (token: string): AccessTokenPayload => verifyAccessToken(token),
    refresh: (token: string): RefreshTokenPayload => verifyRefreshToken(token),
  } as const),
} as const);
