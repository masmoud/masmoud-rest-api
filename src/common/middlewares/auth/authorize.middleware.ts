import { Role } from "@/common/types";
import { errors } from "@/common/utils";
import { NextFunction, Request, Response } from "express";

export const authorize =
  (allowedRoles: Role[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(errors.Forbidden("User not authenticated"));

    if (!allowedRoles.includes(user.role))
      return next(errors.Forbidden("Insufficient permission"));

    next();
  };
