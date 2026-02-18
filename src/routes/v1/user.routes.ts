import { authenticate, authorize, validate } from "@/common/middlewares";
import { Role } from "@/common/types";
import { UserController as uc, updateUserSchema } from "@/modules/user";
import { Router } from "express";

const router = Router();

// Authenticated User Profile
router.get("/profile", authenticate(), uc.profile);

// Users CRUD
router.get("/:id", authenticate(), uc.getUserById);
router.get("/", authenticate(), authorize([Role.ADMIN]), uc.listUsers);
router.delete("/:id", authenticate(), uc.deleteUser);
router.put("/:id", authenticate(), validate(updateUserSchema), uc.updateUser);

export default router;
