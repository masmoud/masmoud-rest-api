import * as u from "@/common/utils";
import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body;
      const result = await authService.register(email, password, role);

      // Set access and refresh tokens HTTP-only cookie
      u.setAuthCookies(res, result.accessToken, result.refreshToken);

      res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error); // pass error to Express error handler
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      // Set refresh token as HTTP-only cookie
      u.setAuthCookies(res, result.accessToken, result.refreshToken);

      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) throw u.UnauthorizedError("No refresh token");

      const tokens = await authService.refresh(token);

      // Rotate cookie
      u.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      res.json({ message: "Token refreshed", accessToken: tokens.accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken;
      const user = req.user;

      if (!user) {
        throw u.UnauthorizedError("User not authenticated");
      }

      if (token) {
        await authService.logout(user.id, token);
      }
      // Clear cookies
      u.clearAuthCookies(res);

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }
}
