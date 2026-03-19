import { hashToken } from "@/common/utils";
import { config } from "@/config";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  JwtExpiry,
  AccessTokenPayload,
  RefreshTokenPayload,
} from "./auth.types";

const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  secret: string,
  expiresIn: JwtExpiry,
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};

const verifyToken = (
  token: string,
  secret: string,
): AccessTokenPayload | RefreshTokenPayload => {
  try {
    return jwt.verify(token, secret) as
      | AccessTokenPayload
      | RefreshTokenPayload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

const generateAccess = (payload: AccessTokenPayload) => {
  return signToken(
    payload,
    config.jwt.access.secret,
    config.jwt.access.expiresIn as JwtExpiry,
  );
};

const generateRefresh = (authId: string) => {
  const refreshToken = signToken(
    { sub: authId },
    config.jwt.refresh.secret,
    config.jwt.refresh.expiresIn as JwtExpiry,
  );
  const hashedRefreshToken = hashToken(refreshToken);
  return { refreshToken, hashedRefreshToken };
};

export const tokenService = {
  sign: {
    access: (payload: AccessTokenPayload) =>
      signToken(
        payload,
        config.jwt.access.secret,
        config.jwt.access.expiresIn as JwtExpiry,
      ),
    refresh: (payload: RefreshTokenPayload) =>
      signToken(
        payload,
        config.jwt.refresh.secret,
        config.jwt.refresh.expiresIn as JwtExpiry,
      ),
  },
  verify: {
    access: (token: string) => verifyToken(token, config.jwt.access.secret),
    refresh: (token: string) => verifyToken(token, config.jwt.refresh.secret),
  },
  generate: {
    access: generateAccess,
    refresh: generateRefresh,
  },
} as const;

export type TokenServiceType = typeof tokenService;
