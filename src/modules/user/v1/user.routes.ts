import { authenticate, authorize, validate } from "@/common/middlewares";
import { Role } from "@/common/types";
import { Router } from "express";
import { UpdateUserSchema } from "../user.validator";
import { userController } from "./user.controller";

const router = Router();

// Authenticated profile endpoints.
router.get("/profile", authenticate(), userController.profile);
router.put(
  "/profile",
  authenticate(),
  validate(UpdateUserSchema),
  userController.updateProfile,
);

// User resource endpoints.
router.get("/:id", authenticate(), userController.getUserById);
router.get(
  "/",
  authenticate(),
  authorize([Role.ADMIN]),
  userController.listUsers,
);
router.delete("/:id", authenticate(), userController.deleteUser);
router.put(
  "/:id",
  authenticate(),
  validate(UpdateUserSchema),
  userController.updateUser,
);

export default router;
