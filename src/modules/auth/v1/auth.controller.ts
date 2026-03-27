import { logs } from "@/common/logger/pino-logger";
import { Role } from "@/common/types";
import {
  asyncHandler,
  authCookies,
  errors,
  sendResponse,
} from "@/common/utils";
import { config } from "@/config";
import { userRepository } from "@/modules/user/v1/user.repository";
import { Request, Response } from "express";
import { AuthPublic } from "../auth.types";
import { authService } from "./auth.service";

class AuthController {
  constructor(
    private readonly service = authService,
    private readonly users = userRepository,
  ) {}

  register = asyncHandler(async (req: Request, res: Response) => {
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

    // Create auth record.
    const auth = await this.service.register(email, password, Role.USER);

    // Create user profile linked to auth id.
    const user = await this.users.create({
      authId: auth.user.id,
    });
    log.info({ userId: user._id, authId: user.authId }, "User profile created");

    // Store access and refresh tokens as HTTP-only cookies.
    authCookies.set(res, auth.accessToken, auth.refreshToken);

    sendResponse(res, 201, {
      user: { id: user._id.toString(), authId: user.authId },
      accessToken: auth.accessToken,
    });
  });

  registerAdmin = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("AUTH_REGISTER_ADMIN", req.requestId);

    const auth = req.auth;

    if (!auth || auth.role !== Role.ADMIN) {
      log.warn({ authId: auth?.id }, "Non-admin attempted admin registration");
      throw errors.Forbidden("Only admins can create new admins");
    }

    const { email, password } = req.body;
    const result = await this.service.register(email, password, Role.ADMIN);
    const admin = await this.users.create({ authId: result.user.id });

    log.info(
      { adminId: admin._id, authId: admin.authId },
      "Admin user created",
    );

    sendResponse(res, 201, {
      user: { id: admin._id.toString(), authId: admin.authId },
      accessToken: result.accessToken,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("AUTH_LOGIN", req.requestId);

    const { email, password } = req.body;
    const result = await this.service.login(email, password);
    authCookies.set(res, result.accessToken, result.refreshToken);

    log.info({ userId: result.user.id, email }, "User logged in");

    sendResponse(
      res,
      200,
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      "User logged in successfully",
    );
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("AUTH_REFRESH", req.requestId);
    const token = req.cookies.refreshToken;

    if (!token) {
      log.warn({}, "Refresh token not provided");
      throw errors.Unauthorized("Refresh token not provided");
    }

    const tokens = await this.service.refresh(token);
    authCookies.set(res, tokens.accessToken, tokens.refreshToken); // Rotate cookie tokens.

    log.info({ userId: req.auth?.id }, "Refresh token rotated");

    sendResponse(
      res,
      200,
      {
        accessToken: tokens.accessToken,
      },
      "Token refreshed",
    );
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("AUTH_LOGOUT", req.requestId);
    const token = req.cookies.refreshToken;
    const auth = req.auth as AuthPublic;

    if (!auth) {
      log.warn({}, "Unauthorized logout attempt");
      throw errors.Unauthorized("User not authenticated");
    }

    if (token) await this.service.logout(auth.id, token);
    authCookies.clear(res);

    log.info({ userId: auth.id }, "User logged out successfully");

    sendResponse(res, 200, { userId: auth.id }, "User logged out successfully");
  });
}

export const authController = new AuthController();
