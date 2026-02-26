import { authCookies, errors, jwtService } from "@/common/utils";
import { AuthModule } from "@/modules/auth";
import { UserModule } from "@/modules/user";
import type { NextFunction, Request, Response } from "express";

export const authenticate = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
        const payload = jwtService.verify.access(token); // type TokenPayload
        const user = await UserModule.service.getUserById(payload.sub);

        if (!user) {
          throw errors.Unauthorized("User not found");
        }

        req.user = user;

        return next();
      } catch (error) {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) throw errors.Unauthorized("Access token expired");

        const tokens = await AuthModule.service.refresh(refreshToken);
        authCookies.set(res, tokens.accessToken, tokens.refreshToken);

        const user = await AuthModule.service.getUserFromToken(
          tokens.accessToken,
          "access",
        );

        req.user = user;

        return next();
      }
    } catch (error) {
      return next(errors.Unauthorized("Invalid or expired token"));
    }
  };
};
