import { authenticate, authorize, validate } from "@/common/middlewares";
import { Role } from "@/common/types";

import { Router } from "express";
import { authController } from "./auth.controller";
import { authSchemas } from "./auth.validator";

const router = Router();

router.post(
  "/admin/register",
  authenticate(),
  authorize([Role.ADMIN]),
  validate(authSchemas.register),
  authController.registerAdmin,
);

router.post(
  "/register",
  validate(authSchemas.register),
  authController.register,
);

router.post("/login", validate(authSchemas.login), authController.login);
router.post("/refresh", authenticate(), authController.refresh);
router.post("/logout", authenticate(), authController.logout);

export default router;
