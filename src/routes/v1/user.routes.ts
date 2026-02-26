import { authenticate, authorize, validate } from "@/common/middlewares";
import { Role } from "@/common/types";
import { UserModule as module } from "@/modules/user";
import { Router } from "express";

const router = Router();

// Authenticated User Profile
router.get("/profile", authenticate(), module.controller.profile);

// Users CRUD
router.get("/:id", authenticate(), module.controller.getUserById);
router.get(
  "/",
  authenticate(),
  authorize([Role.ADMIN]),
  module.controller.listUsers,
);
router.delete("/:id", authenticate(), module.controller.deleteUser);
router.put(
  "/:id",
  authenticate(),
  validate(module.schemas.update),
  module.controller.updateUser,
);

export default router;
