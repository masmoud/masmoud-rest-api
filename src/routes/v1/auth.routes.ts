import { authenticate, authorize, validate } from "@/common/middlewares";
import { Role } from "@/common/types";
import { AuthModule as module } from "@/modules/auth";

import { Router } from "express";

const router = Router();

router.post(
  "/register",
  validate(module.schemas.register),
  module.controller.register,
);

router.post(
  "/admin/register",
  authenticate(),
  authorize([Role.ADMIN]),
  validate(module.schemas.register),
  module.controller.registerAdmin,
);

router.post("/login", validate(module.schemas.login), module.controller.login);
router.post("/refresh", authenticate(), module.controller.refresh);
router.post("/logout", authenticate(), module.controller.logout);

export default router;
