import { jwtService, authCookies, errors } from "@/common/utils";
import { authService } from "@/modules/auth";
import type { NextFunction, Request, Response } from "express";
import { RequestUser } from "@/modules/auth/auth.types";
import { Role } from "@/common/types";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

export const authenticate = () => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const cookieToken = req.cookies["accessToken"];
      const authHeader = req.headers.authorization;

      let headerToken: string | null = null;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        headerToken = authHeader.split(" ")[1];
      }

      const token = cookieToken || headerToken;
      if (!token) throw errors.Unauthorized("Missing access token");

      try {
        // Verify access token
        const payload = jwtService.verify.access(token); // type AccessTokenPayload

        req.user = {
          id: payload.sub as string,
          role: payload.role as Role,
        } as RequestUser;
        // Attach full safe user to res.locals.user
        if (!res.locals.user) {
          const fullUser = await authService.getUserFromToken(token);
          res.locals.user = fullUser;
        }

        return next();
      } catch (error) {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) throw errors.Unauthorized("Access token expired");

        const tokens = await authService.refresh(refreshToken);
        authCookies.set(res, tokens.accessToken, tokens.refreshToken);

        const fullUser = await authService.getUserFromToken(
          tokens.accessToken,
          "access",
        );

        req.user = { id: fullUser.id, role: fullUser.role };
        res.locals.user = fullUser;

        return next();
      }
    } catch (error) {
      return next(errors.Unauthorized("Invalid or expired token"));
    }
  };
};
