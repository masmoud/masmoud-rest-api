import { authenticate, validate } from "@/common/middlewares";
import {
  AuthController as ac,
  loginSchema,
  registerSchema,
} from "@/modules/auth";
import { Router } from "express";

const router = Router();

router.post("/register", validate(registerSchema), ac.register);
router.post("/login", validate(loginSchema), ac.login);
router.post("/refresh", authenticate(), ac.refresh);
router.post("/logout", authenticate(), ac.logout);

export default router;
