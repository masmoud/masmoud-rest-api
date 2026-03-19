import { logs } from "@/common/logger/pino-logger";
import { asyncHandler, errors, sendResponse } from "@/common/utils";
import {
  authRepository,
  AuthRepository,
} from "@/modules/auth/v1/auth.repository";
import { Request, Response } from "express";
import { userService } from "./user.service";

class UserController {
  constructor(
    private readonly service = userService,
    private readonly authRepo: AuthRepository = authRepository,
  ) {}

  profile = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("CURRENT_USER", req.requestId);

    const user = req.user;
    if (!user) throw errors.Unauthorized("User is not authenticated");

    log.info({ userId: user.id, message: "Profile fetched" });
    return sendResponse(res, 200, user, "Profile fetched");
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("USER_LOOKUP", req.requestId);

    const userId = req.params.id as string;
    if (!userId) throw errors.NotFound("User ID is missing");

    const user = await this.service.getUserById(userId);

    log.info({ user, message: "User fetched" });
    return sendResponse(res, 200, user, "User fetched");
  });

  listUsers = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("USER_LIST", req.requestId);

    const users = await this.service.listUsers();

    log.info({ users, message: "Users fetched" });
    return sendResponse(res, 200, users, "Users fetched");
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("USER_UPDATE", req.requestId);

    const userId = req.params.id as string;
    if (!userId) throw errors.NotFound("User ID is missing");

    const updatedUser = await this.service.updateUser(userId, req.body);

    log.info({ userId, message: "User updated successfully" });
    return sendResponse(res, 200, updatedUser, "User updated successfully");
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const log = logs.child("USER_DELETE", req.requestId);

    const userId = req.params.id as string;
    if (!userId) throw errors.NotFound("User ID is missing");

    // Fetch user to get authId before deletion
    const user = await this.service.getUserById(userId);
    if (!user) throw errors.NotFound("User not found");

    // Delete associated auth record if it exists
    if (user.authId) {
      const deletedAuth = await this.authRepo.deleteById(user.authId);
      if (deletedAuth) {
        log.info({ userId, message: "Associated auth record deleted" });
      }
    }

    // Delete the user
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

export const userController = new UserController();
