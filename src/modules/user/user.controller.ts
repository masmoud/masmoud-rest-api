import { errors } from "@/common/utils";
import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";

class UserController {
  constructor(private readonly service = userService) {}

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw errors.Unauthorized("User is not authenticated");
      const user = req.user;
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string;
      if (!userId) throw errors.NotFound("User ID is missing");

      const user = await this.service.getUserById(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.service.listUsers();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string;
      if (!userId) throw errors.NotFound("User ID is missing");

      const data = req.body;

      const updatedUser = await this.service.updateUser(userId, data);
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string;
      if (!userId) throw errors.NotFound("User ID is missing");
      await this.service.deleteUser(userId);

      res.status(200).json({
        message: "User deleted successfully",
        userId,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
