import { authenticate, authorize, validate } from "@/common/middlewares";
import { Role } from "@/common/types";
import { Router } from "express";
import { UpdateUserSchema } from "../user.validator";
import { userController } from "./user.controller";

const router = Router();

// Authenticated User Profile
router.get("/profile", authenticate(), userController.profile);

// Users CRUD
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
