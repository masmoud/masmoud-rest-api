import { RoleType } from "@/common/types";
import { errors } from "@/common/utils";
import { NextFunction, Request, Response } from "express";

export const authorize =
  (allowedRoles: RoleType[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const auth = req.auth;
    if (!auth) return next(errors.Forbidden("User not authenticated"));

    if (!allowedRoles.includes(auth.role))
      return next(errors.Forbidden("Insufficient permission"));

    next();
  };
