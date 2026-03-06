import { errors, hashToken } from "@/common/utils";
import { config } from "@/config";
import { Request } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { JwtExpiry, TokenPayload } from "./auth.types";

export const tokenService = {
  // Namespaced signing methods
  sign: {
    access: (payload: TokenPayload): string => {
      const options: SignOptions = {
        expiresIn: config.jwt.access.expiresIn as JwtExpiry,
      };
      return jwt.sign(payload, config.jwt.access.secret, options);
    },

    refresh: (payload: TokenPayload): string => {
      const options: SignOptions = {
        expiresIn: config.jwt.refresh.expiresIn as JwtExpiry,
      };
      return jwt.sign(payload, config.jwt.refresh.secret, options);
    },
  } as const,

  // Namespaced generation helpers
  generate: {
    refresh: (userId: string) => {
      const refreshToken = tokenService.sign.refresh({ sub: userId });
      const hashedRefreshToken = hashToken(refreshToken);

      return { refreshToken, hashedRefreshToken };
    },
  } as const,
} as const;

export type TokenServiceType = typeof tokenService;

export const authUtils = {
  token: tokenService,
};
