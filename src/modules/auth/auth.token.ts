import { errors } from "@/common/utils";
import { config } from "@/config";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  AccessTokenPayload,
  JwtExpiry,
  RefreshTokenPayload,
} from "./auth.types";

/** Signs a JWT with the given payload, secret, and expiry. */
const signToken = <T extends object>(
  payload: T,
  secret: string,
  expiresIn: JwtExpiry,
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};

/** Verifies a JWT and returns its decoded payload. Throws if invalid or expired. */
const verifyToken = <T>(token: string, secret: string): T => {
  try {
    return jwt.verify(token, secret) as T;
  } catch (err) {
    throw errors.Unauthorized("Invalid or expired token");
  }
};

/** Generates a signed access token from the given payload. */
const generateAccessToken = (payload: AccessTokenPayload) => {
  const accessToken = signToken(
    payload,
    config.jwt.access.secret,
    config.jwt.access.expiresIn as JwtExpiry,
  );
  return { accessToken };
};

/**
 * Generates a signed refresh token and its hash.
 * The raw token is sent to the client; only the hash is stored in the database.
 */
const generateRefreshToken = (payload: RefreshTokenPayload) => {
  const refreshToken = signToken(
    payload,
    config.jwt.refresh.secret,
    config.jwt.refresh.expiresIn as JwtExpiry,
  );
  return { refreshToken };
};

/** Verifies the access token and returns its decoded payload. */
const verifyAccessToken = (token: string) =>
  verifyToken<AccessTokenPayload>(token, config.jwt.access.secret);

/** Verifies the refresh token and returns its decoded payload. */
const verifyRefreshToken = (token: string) =>
  verifyToken<RefreshTokenPayload>(token, config.jwt.refresh.secret);

export const tokenService = {
  generate: {
    access: generateAccessToken,
    refresh: generateRefreshToken,
  },
  verify: {
    access: verifyAccessToken,
    refresh: verifyRefreshToken,
  },
} as const;

export type TokenService = typeof tokenService;
