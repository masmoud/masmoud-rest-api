import { authenticate, authorize, validate } from "@/common/middlewares";
import { Role } from "@/common/types";
import { asyncHandler } from "@/common/utils";
import { Router } from "express";
import { UpdateUserSchema } from "../user.validation";
import { UserController } from "./user.controller";

export const createUserRoutes = (controller: UserController) => {
  const router = Router();

  // Returns the authenticated user's own profile.
  router.get("/profile", authenticate(), asyncHandler(controller.profile));

  // Updates the authenticated user's own profile.
  router.put(
    "/profile",
    authenticate(),
    validate(UpdateUserSchema),
    asyncHandler(controller.updateProfile),
  );

  // Returns a user by ID; enforces self-or-admin access.
  router.get("/:id", authenticate(), asyncHandler(controller.getUserById));

  // Admin only: returns all users.
  router.get(
    "/",
    authenticate(),
    authorize([Role.ADMIN]),
    asyncHandler(controller.listUsers),
  );

  // Deletes the authenticated user's own account.
  router.delete(
    "/",
    authenticate(),
    asyncHandler(controller.deleteCurrentUser),
  );

  // Deletes a user and their auth record; enforces self-or-admin access.
  router.delete(
    "/:id",
    authenticate(),
    authorize([Role.ADMIN]),
    asyncHandler(controller.deleteUserById),
  );

  // Updates a user by ID; enforces self-or-admin access.
  router.put(
    "/:id",
    authenticate(),
    validate(UpdateUserSchema),
    asyncHandler(controller.updateUser),
  );

  return router;
};
