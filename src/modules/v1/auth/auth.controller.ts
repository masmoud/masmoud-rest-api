import { Role } from "@/common/types";
import { authCookies, errors } from "@/common/utils";
import { config } from "@/config";
import { NextFunction, Request, Response } from "express";
import { UserPublic } from "../user";
import { authService } from "./auth.service";

class AuthController {
  constructor(private readonly service = authService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const isAdminEmail = config.auth.adminUsers.some(
        (admin) => admin.email === email,
      );

      if (isAdminEmail) {
        return res.status(403).json({
          message: "Admin accounts cannot register through public endpoint.",
        });
      }

      const result = await authService.register(email, password, Role.USER);

      // Set access and refresh tokens HTTP-only cookie
      authCookies.set(res, result.accessToken, result.refreshToken);

      res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error); // pass error to Express error handler
    }
  }

  async registerAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user;

      if (!currentUser || currentUser.role !== Role.ADMIN) {
        throw errors.Forbidden("Only admins can create new admins");
      }

      const { email, password } = req.body;
      const result = await this.service.register(email, password, Role.ADMIN);

      res.status(201).json({
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      // Set refresh token as HTTP-only cookie
      authCookies.set(res, result.accessToken, result.refreshToken);

      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) throw errors.Unauthorized("Refresh token not provided");

      const tokens = await authService.refresh(token);
      authCookies.set(res, tokens.accessToken, tokens.refreshToken); // Rotate token

      res.json({ message: "Token refreshed", accessToken: tokens.accessToken });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken;
      const user = req.user as UserPublic;

      if (!user) throw errors.Unauthorized("User not authenticated");

      if (token) await authService.logout(user.id, token);

      authCookies.clear(res);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
