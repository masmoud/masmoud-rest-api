import { hashToken, errors } from "@/common/utils";
import { Request } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  AccessTokenPayload,
  JwtExpiry,
  RefreshTokenPayload,
} from "./auth.types";
import { config } from "@/config";

export const tokenService = Object.freeze({
  // Require authenticated user in request
  requireUser: (req: Request) => {
    if (!req.user) throw errors.Unauthorized("User not authenticated");
    return req.user;
  },

  // Namespaced signing methods
  sign: Object.freeze({
    access: (payload: AccessTokenPayload): string => {
      const options: SignOptions = {
        expiresIn: config.jwt.access.expiresIn as JwtExpiry,
      };
      return jwt.sign(payload, config.jwt.access.secret, options);
    },

    refresh: (payload: RefreshTokenPayload): string => {
      const options: SignOptions = {
        expiresIn: config.jwt.refresh.expiresIn as JwtExpiry,
      };
      return jwt.sign(payload, config.jwt.refresh.secret, options);
    },
  }),

  // Namespaced generation helpers
  generate: Object.freeze({
    refresh: (userId: string) => {
      const refreshToken = tokenService.sign.refresh({ sub: userId });
      const hashedRefreshToken = hashToken(refreshToken);

      return { refreshToken, hashedRefreshToken };
    },
  }),
});
