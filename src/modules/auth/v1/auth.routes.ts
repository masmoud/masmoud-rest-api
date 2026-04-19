import { authenticate, authorize, validate } from "@/common/middlewares";
import { Role } from "@/common/types";

import { authRateLimiter } from "@/common/middlewares/security/rate-limit";
import { asyncHandler } from "@/common/utils";
import { Router } from "express";
import { LoginSchema, RegisterSchema } from "../auth.validation";
import { AuthController } from "./auth.controller";

export const createAuthRoutes = (controller: AuthController) => {
  const router = Router();

  // Admin-only: create a new admin account.
  router.post(
    "/admin/register",
    authRateLimiter,
    authenticate(),
    authorize([Role.ADMIN]),
    validate(RegisterSchema),
    asyncHandler(controller.registerAdmin),
  );

  // Public: register a new user account.
  router.post(
    "/register",
    authRateLimiter,
    validate(RegisterSchema),
    asyncHandler(controller.register),
  );

  // Public: authenticate and issue tokens.
  router.post(
    "/login",
    authRateLimiter,
    validate(LoginSchema),
    asyncHandler(controller.login),
  );

  // Rotate the refresh token and issue a new access token.
  router.post(
    "/refresh",
    authRateLimiter,
    authenticate(),
    asyncHandler(controller.refresh),
  );

  // Invalidate the session and clear auth cookies.
  router.post(
    "/logout",
    authRateLimiter,
    authenticate(),
    asyncHandler(controller.logout),
  );

  return router;
};
