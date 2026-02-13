import { UnauthorizedError } from "@/common/utils";
import type { NextFunction, Request, Response } from "express";
import { Role } from "../user/user.types";
import { verifyAccessToken } from "./auth.jwt";
import { AuthService } from "./auth.service";
import { RequestUser } from "./auth.types";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const authService = new AuthService();

  // Check if Authorization header exists and starts with Bearer
  if (!authHeader?.startsWith("Bearer ")) {
    return next(UnauthorizedError("Unauthorized"));
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify access token and get minimal payload
    const payload = verifyAccessToken(token); // type AccessTokenPayload

    // Attach miniam user info to req.user
    req.user = {
      id: payload.sub as string,
      role: payload.role as Role,
    } as RequestUser;

    // Attach full safe user to res.locals.user
    if (!res.locals.user) {
      const fullUser = await authService.getUserFromToken(token);
      res.locals.user = fullUser;
    }

    next();
  } catch (error) {
    return next(UnauthorizedError("Invalid or expired token"));
  }
};
