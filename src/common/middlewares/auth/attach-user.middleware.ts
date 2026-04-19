import { toPublicUser } from "@/modules/user/user.utils";
import { userRepo } from "@/context";
import { Request, Response, NextFunction } from "express";

export const attachUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.auth) return next();

    const user = await userRepo.findByAuthId(req.auth.id);
    if (!user) return next();

    req.user = toPublicUser(user);
    next();
  } catch (error) {
    next(error);
  }
};
