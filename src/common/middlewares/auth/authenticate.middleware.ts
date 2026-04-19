import { errors } from "@/common/utils";
import { authRepo } from "@/context";
import { tokenService } from "@/modules/auth/auth.token";
import { toPublicAuth } from "@/modules/auth/auth.utils";

import type { NextFunction, Request, Response } from "express";

const extractTokenFromRequest = (req: Request): string | null => {
  const cookieToken = req.cookies["accessToken"];
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return cookieToken || null;
};

export const authenticate = () => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = extractTokenFromRequest(req);
      if (!token) throw errors.Unauthorized("Missing access token");

      const payload = tokenService.verify.access(token);

      const auth = await authRepo.findById(payload.sub);
      if (!auth) throw errors.Unauthorized("Invalid or expired token");

      req.auth = toPublicAuth(auth);
      next();
    } catch {
      next(errors.Unauthorized("Invalid or expired token"));
    }
  };
};
