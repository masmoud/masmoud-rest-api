import { authCookies, errors } from "@/common/utils";
import { authService } from "@/modules/auth/v1/auth.service";
import { toPublicUser } from "@/modules/user/user.utils";
import { userRepository } from "@/modules/user/v1/user.repository";

import type { NextFunction, Request, Response } from "express";

const extractTokenFromHeader = (req: Request): string | null => {
  const cookieToken = req.cookies["accessToken"];
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return cookieToken || null;
};

export const authenticate = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token
      const token = extractTokenFromHeader(req);
      if (!token) throw errors.Unauthorized("Missing access token");

      let auth = null;

      try {
        // Try to get AuthContext from access token
        auth = await authService.getAuthFromToken(token);
      } catch {
        // If access token fails, try refresh token rotation
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) throw errors.Unauthorized("Access token expired");

        // Rotate tokens
        const tokens = await authService.refresh(refreshToken);

        // Update cookies
        authCookies.set(res, tokens.accessToken, tokens.refreshToken);

        // Re-fetch AuthContext from new access token
        auth = await authService.getAuthFromToken(tokens.accessToken, "access");
      }
      if (!auth) throw errors.Unauthorized("Invalid or expired token");

      // Fetch associated user
      const user = await userRepository.findByAuthId(auth.id);
      if (!user) throw errors.Unauthorized("User not foud");

      // Attach to request
      req.auth = auth;
      req.user = toPublicUser(user);

      next();
    } catch (error) {
      return next(errors.Unauthorized("Invalid or expired token"));
    }
  };
};
