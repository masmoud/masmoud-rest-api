import { UserManagementService } from "@/application/user-management.service";
import { logs } from "@/common/logger/pino-logger";
import { Role } from "@/common/types";
import { errors, sendResponse } from "@/common/utils";
import { Request, Response } from "express";
import { toPublicUser } from "../user.utils";
import { UserService } from "./user.service";

export type UserController = ReturnType<typeof createUserController>;

export const createUserController = (
  service: UserService,
  userManagementService: UserManagementService,
) => {
  const ensureSelfOrAdmin = (req: Request, userId: string) => {
    const auth = req.auth;
    const currentUser = req.user;

    if (!auth || !currentUser) {
      throw errors.Unauthorized("User is not authenticated");
    }

    if (auth.role === Role.ADMIN || currentUser.id === userId) {
      return;
    }

    throw errors.Forbidden("Insufficient permission");
  };

  return {
    /** Returns the authenticated user's own profile. */
    profile: async (req: Request, res: Response) => {
      const log = logs.child("CURRENT_USER", req.requestId);

      const user = req.user;
      if (!user) throw errors.Unauthorized("User is not authenticated");

      log.info({ userId: user.id, message: "Profile fetched" });
      return sendResponse(res, 200, user, "Profile fetched");
    },

    /** Updates the authenticated user's own profile. */
    updateProfile: async (req: Request, res: Response) => {
      const log = logs.child("CURRENT_USER_UPDATE", req.requestId);

      const user = req.user;
      if (!user) throw errors.Unauthorized("User is not authenticated");

      const updatedUser = await service.updateUser(user.id, req.body);

      log.info({ userId: user.id, message: "Profile updated successfully" });
      return sendResponse(
        res,
        200,
        toPublicUser(updatedUser),
        "Profile updated successfully",
      );
    },

    /** Returns a user by ID; enforces self-or-admin access. */
    getUserById: async (req: Request, res: Response) => {
      const log = logs.child("USER_LOOKUP", req.requestId);

      const userId = req.params.id as string;
      if (!userId) throw errors.NotFound("User ID is missing");

      ensureSelfOrAdmin(req, userId);

      const user = await service.getUserById(userId);

      log.info({ userId, message: "User fetched" });
      return sendResponse(res, 200, toPublicUser(user), "User fetched");
    },

    /** Returns all users; admin only. */
    listUsers: async (req: Request, res: Response) => {
      const log = logs.child("USER_LIST", req.requestId);

      const users = await service.listUsers();
      const publicUsers = users.map(toPublicUser);

      log.info({ count: publicUsers.length, message: "Users fetched" });
      return sendResponse(res, 200, publicUsers, "Users fetched");
    },

    /** Updates a user by ID; enforces self-or-admin access. */
    updateUser: async (req: Request, res: Response) => {
      const log = logs.child("USER_UPDATE", req.requestId);

      const userId = req.params.id as string;
      if (!userId) throw errors.NotFound("User ID is missing");

      ensureSelfOrAdmin(req, userId);

      const updatedUser = await service.updateUser(userId, req.body);

      log.info({ userId, message: "User updated successfully" });
      return sendResponse(
        res,
        200,
        toPublicUser(updatedUser),
        "User updated successfully",
      );
    },

    /** Deletes the authenticated user's own account. */
    deleteCurrentUser: async (req: Request, res: Response) => {
      const log = logs.child("USER_DELETE_CURRENT", req.requestId);

      const user = req.user;
      if (!user) throw errors.Unauthorized("User is not authenticated");

      await userManagementService.deleteUserWithAuth(user.id);

      log.info({ userId: user.id, message: "User deleted successfully" });

      return sendResponse(
        res,
        200,
        { userId: user.id },
        "User deleted successfully",
      );
    },

    /** Deletes a user and their auth record; enforces self-or-admin access. */
    deleteUserById: async (req: Request, res: Response) => {
      const log = logs.child("USER_DELETE_ADMIN", req.requestId);

      const userId = req.params.id as string;
      if (!userId) throw errors.NotFound("User ID is missing");

      ensureSelfOrAdmin(req, userId);

      await service.getUserById(userId);
      await userManagementService.deleteUserWithAuth(userId);

      log.info({ userId, message: "User deleted successfully" });

      return sendResponse(
        res,
        200,
        { userId },
        "User and Auth deleted successfully",
      );
    },
  };
};
