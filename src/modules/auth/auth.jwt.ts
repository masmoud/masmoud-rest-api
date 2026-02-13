import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { AccessTokenPayload, RefreshTokenPayload } from "./auth.types";
import { jwtConfig } from "@/config/env";
import { UnauthorizedError } from "@/common/utils";

// Helper function to sign a token
const signToken = <T extends object>(
  payload: T,
  secret: string,
  expiresIn: string | number,
): string => {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, secret, options);
};

// Access Token
const signAccessToken = (payload: AccessTokenPayload) =>
  signToken(payload, jwtConfig.access.secret, jwtConfig.access.expiresIn);

// Refresh Token
const signRefreshToken = (payload: RefreshTokenPayload) =>
  signToken(payload, jwtConfig.refresh.secret, jwtConfig.refresh.expiresIn);

// Verify Token
const verifyToken = <T>(token: string, secret: Secret): T => {
  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded !== "object" || !decoded) {
      throw UnauthorizedError("Invalid token payload");
    }

    return decoded as T;
  } catch (error) {
    throw UnauthorizedError("Invalid or expired token");
  }
};

// Verify Access Token
const verifyAccessToken = (token: string): AccessTokenPayload => {
  const payload = verifyToken<AccessTokenPayload>(
    token,
    jwtConfig.access.secret,
  );

  if (!payload.sub || !payload.role) {
    throw UnauthorizedError("Invalid access token payload");
  }

  return payload;
};
// Verify Refresh Token
const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const payload = verifyToken<RefreshTokenPayload>(
    token,
    jwtConfig.refresh.secret,
  );
  if (!payload.sub) {
    throw UnauthorizedError("Invalid refresh token payload");
  }

  return payload;
};

export {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
