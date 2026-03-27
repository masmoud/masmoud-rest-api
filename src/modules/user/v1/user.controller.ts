import { logs } from "@/common/logger/pino-logger";
import { Role } from "@/common/types";
import { asyncHandler, errors, sendResponse } from "@/common/utils";
import {
  authRepository,
  AuthRepository,
} from "@/modules/auth/v1/auth.repository";
import { Request, Response } from "express";
import { toPublicUser } from "../user.utils";
import { userService } from "./user.service";

class UserController {
  constructor(
    private readonly service = userService,
    private readonly authRepo: AuthRepository = authRepository,
  ) {}

  private ensureSelfOrAdmin(req: Request, targetUserId: string) {
    const auth = req.auth;
    const currentUser = req.user;

    if (!auth || !currentUser) {
      throw errors.Unauthorized("User is not authenticated");
    }

    if (auth.role === Role.ADMIN || currentUser.id === targetUserId) {
      return;
    }

    throw errors.Forbidden("Insufficient permission");
  }

  profile = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("CURRENT_USER", req.requestId);

    const user = req.user;
    if (!user) throw errors.Unauthorized("User is not authenticated");

    log.info({ userId: user.id, message: "Profile fetched" });
    return sendResponse(res, 200, user, "Profile fetched");
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("CURRENT_USER_UPDATE", req.requestId);

    const user = req.user;
    if (!user) throw errors.Unauthorized("User is not authenticated");

    const updatedUser = await this.service.updateUser(user.id, req.body);

    log.info({ userId: user.id, message: "Profile updated successfully" });
    return sendResponse(
      res,
      200,
      toPublicUser(updatedUser),
      "Profile updated successfully",
    );
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("USER_LOOKUP", req.requestId);

    const userId = req.params.id as string;
    if (!userId) throw errors.NotFound("User ID is missing");

    this.ensureSelfOrAdmin(req, userId);

    const user = await this.service.getUserById(userId);

    log.info({ userId, message: "User fetched" });
    return sendResponse(res, 200, toPublicUser(user), "User fetched");
  });

  listUsers = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("USER_LIST", req.requestId);

    const users = await this.service.listUsers();
    const publicUsers = users.map(toPublicUser);

    log.info({ count: publicUsers.length, message: "Users fetched" });
    return sendResponse(res, 200, publicUsers, "Users fetched");
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("USER_UPDATE", req.requestId);

    const userId = req.params.id as string;
    if (!userId) throw errors.NotFound("User ID is missing");

    this.ensureSelfOrAdmin(req, userId);

    const updatedUser = await this.service.updateUser(userId, req.body);

    log.info({ userId, message: "User updated successfully" });
    return sendResponse(
      res,
      200,
      toPublicUser(updatedUser),
      "User updated successfully",
    );
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("USER_DELETE", req.requestId);

    const userId = req.params.id as string;
    if (!userId) throw errors.NotFound("User ID is missing");

    this.ensureSelfOrAdmin(req, userId);

    // Load user first to access linked auth id.
    const user = await this.service.getUserById(userId);
    if (!user) throw errors.NotFound("User not found");

    // Delete linked auth record when present.
    if (user.authId) {
      const deletedAuth = await this.authRepo.deleteById(user.authId);
      if (deletedAuth) {
        log.info({ userId, message: "Associated auth record deleted" });
      }
    }

    // Delete user record.
    await this.service.deleteUser(userId);
    log.info({ userId, message: "User deleted successfully" });

    return sendResponse(
      res,
      200,
      { userId },
      "User and Auth deleted successfully",
    );
  });
}

export { UserController };
export const userController = new UserController();
