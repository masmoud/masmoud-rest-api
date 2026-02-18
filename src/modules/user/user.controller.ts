import { RequestHandler } from "express";
import { userService } from "./user.service";
import { errors } from "@/common/utils";

export class UserController {
  static profile: RequestHandler = async (_req, res, next) => {
    try {
      res.json({ user: res.locals.user });
    } catch (error) {
      next(error);
    }
  };

  static getUserById: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.params.id as string;
      if (!userId) throw errors.NotFound("User ID is missing");

      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  static listUsers: RequestHandler = async (_req, res, next) => {
    try {
      const users = await userService.listUsers();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  };

  static updateUser: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.params.id as string;
      if (!userId) throw errors.NotFound("User ID is missing");

      const data = req.body;

      const updatedUser = await userService.updateUser(userId, data);
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      next(error);
    }
  };

  static deleteUser: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.params.id as string;
      if (!userId) throw errors.NotFound("User ID is missing");
      await userService.deleteUser(userId);

      res.status(200).json({
        message: "User deleted successfully",
        userId,
      });
    } catch (error) {
      next(error);
    }
  };
}
