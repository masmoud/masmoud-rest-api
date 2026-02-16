import { validate } from "@/common/middlewares/validators/validate";
import { authenticate, authorize } from "@/modules/auth";
import { UserController } from "@/modules/user/user.controller";
import { Role } from "@/modules/user/user.types";
import { updateUserSchema } from "@/modules/user/user.validator";
import { Router } from "express";

const router = Router();

// Authenticated User Profile
router.get("/profile", authenticate(), UserController.profile);

// Users CRUD
router
  .get("/:id", authenticate(), UserController.getUserById)
  .get("/", authenticate(), authorize([Role.ADMIN]), UserController.listUsers)
  .delete("/:id", authenticate(), UserController.deleteUser)
  .put(
    "/:id",
    authenticate(),
    validate(updateUserSchema),
    UserController.updateUser,
  );

export default router;
