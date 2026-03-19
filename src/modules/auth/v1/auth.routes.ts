import { authenticate, authorize, validate } from "@/common/middlewares";
import { Role } from "@/common/types";

import { Router } from "express";
import { LoginSchema, RegisterSchema } from "../auth.validator";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  "/admin/register",
  authenticate(),
  authorize([Role.ADMIN]),
  validate(RegisterSchema),
  authController.registerAdmin,
);

router.post("/register", validate(RegisterSchema), authController.register);
router.post("/login", validate(LoginSchema), authController.login);
router.post("/refresh", authenticate(), authController.refresh);
router.post("/logout", authenticate(), authController.logout);

export default router;
