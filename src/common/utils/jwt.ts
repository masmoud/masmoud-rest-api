import { config } from "@/config/env";
import { AccessTokenPayload, RefreshTokenPayload } from "@/modules/auth";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UnauthorizedError } from "./errors";

// Secrets typed as Secret
const ACCESS_SECRET: Secret = config.jwt.access.secret;
const REFRESH_SECRET: Secret = config.jwt.refresh.secret;

// ExpiresIn typed as StringValue | number
type JwtExpiry = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}` | number;

const ACCESS_EXPIRES_IN: JwtExpiry = config.jwt.access.expiresIn as JwtExpiry;
const REFRESH_EXPIRES_IN: JwtExpiry = config.jwt.refresh.expiresIn as JwtExpiry;

/**
 * Signs a JWT access token
 */
export const signAccessToken = (payload: AccessTokenPayload) => {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES_IN };
  return jwt.sign(payload, ACCESS_SECRET, options);
};

/**
 * Signs a JWT refresh token
 */
export const signRefreshToken = (payload: RefreshTokenPayload) => {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRES_IN };
  return jwt.sign(payload, REFRESH_SECRET, options);
};

/**
 * Verifies access token
 */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const payload = jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;

  if (!payload.sub || !payload.role) {
    throw UnauthorizedError("Invalid access token payload");
  }

  return payload;
};

/**
 * Verifies refresh token
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const payload = jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;

  if (!payload.sub) {
    throw UnauthorizedError("Invalid refresh token payload");
  }

  return payload;
};
