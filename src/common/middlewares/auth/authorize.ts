import { ForbiddenError } from "@/common/utils";
import { NextFunction, Request, Response } from "express";
import { Role } from "../../../modules/user/user.types";

export const authorize =
  (...allowedRoles: Role[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(ForbiddenError("User not authenticated"));

    if (!allowedRoles.includes(user.role))
      return next(ForbiddenError("Insufficient permission"));

    next();
  };
