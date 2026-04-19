import { logs } from "@/common/logger/pino-logger";
import { Role } from "@/common/types";
import { authCookies, errors, sendResponse } from "@/common/utils";
import { config } from "@/config";
import { Request, Response } from "express";
import { AuthPublic, AuthService } from "../auth.types";

export type AuthController = ReturnType<typeof createAuthController>;

export const createAuthController = (service: AuthService) => ({
  /** Registers a new user. Blocks admin emails from using this public endpoint. */
  register: async (req: Request, res: Response) => {
    const log = logs.child("AUTH_REGISTER", req.requestId);

    const { email, password } = req.body;

    const isAdminEmail = config.auth.adminUsers.some(
      (admin) => admin.email === email,
    );

    if (isAdminEmail) {
      log.warn({ email }, "Attempted admin registration via public endpoint");
      throw errors.Forbidden(
        "Admin accounts cannot register through public endpoint.",
      );
    }

    const result = await service.register(email, password);
    log.info(result.auth, "User profile created");

    if (result.type !== "tokens") {
      throw errors.InternalServerError("Token generation failed");
    }

    authCookies.set(res, result.accessToken, result.refreshToken);

    sendResponse(res, 201, {
      user: result.auth,
      accessToken: result.accessToken,
    });
  },

  /** Registers a new admin. Only callable by an existing admin. */
  registerAdmin: async (req: Request, res: Response) => {
    const log = logs.child("AUTH_REGISTER_ADMIN", req.requestId);

    const currentAuth = req.auth;

    if (!currentAuth || currentAuth.role !== Role.ADMIN) {
      log.warn(
        { authId: currentAuth?.id },
        "Non-admin attempted admin registration",
      );
      throw errors.Forbidden("Only admins can create new admins");
    }

    const { email, password } = req.body;
    const result = await service.register(email, password, Role.ADMIN);

    if (result.type !== "tokens") {
      throw errors.InternalServerError("Token generation failed");
    }

    authCookies.set(res, result.accessToken, result.refreshToken);

    log.info(result.auth, "Admin user created");

    sendResponse(res, 201, {
      user: result.auth,
      accessToken: result.accessToken,
    });
  },

  /** Validates credentials and issues access + refresh tokens as HTTP-only cookies. */
  login: async (req: Request, res: Response) => {
    const log = logs.child("AUTH_LOGIN", req.requestId);

    const { email, password } = req.body;
    const result = await service.login(email, password);
    authCookies.set(res, result.accessToken, result.refreshToken);

    log.info({ authId: result.auth.id, email }, "User logged in");

    sendResponse(
      res,
      200,
      {
        auth: result.auth,
        accessToken: result.accessToken,
      },
      "User logged in successfully",
    );
  },

  /** Rotates the refresh token and returns a new access token. Throws if no refresh cookie is present. */
  refresh: async (req: Request, res: Response) => {
    const log = logs.child("AUTH_REFRESH", req.requestId);
    const token = req.cookies.refreshToken;

    if (!token) {
      log.warn({}, "Refresh token not provided");
      throw errors.Unauthorized("Refresh token not provided");
    }

    const tokens = await service.refresh(token);
    authCookies.set(res, tokens.accessToken, tokens.refreshToken);

    log.info({ userId: req.auth?.id }, "Refresh token rotated");

    sendResponse(
      res,
      200,
      {
        accessToken: tokens.accessToken,
      },
      "Token refreshed",
    );
  },

  /** Invalidates the session by removing the refresh token and clearing auth cookies. */
  logout: async (req: Request, res: Response) => {
    const log = logs.child("AUTH_LOGOUT", req.requestId);
    const token = req.cookies.refreshToken;
    const auth = req.auth as AuthPublic;

    if (!auth) {
      log.warn({}, "Unauthorized logout attempt");
      throw errors.Unauthorized("User not authenticated");
    }

    if (token) await service.logout(auth.id, token);
    authCookies.clear(res);

    log.info({ authId: auth.id }, "User logged out successfully");

    sendResponse(res, 200, { authId: auth.id }, "User logged out successfully");
  },
});
