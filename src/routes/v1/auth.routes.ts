import { validate } from "@/common/middlewares/validators/validate";
import { authenticate } from "@/modules/auth";
import { AuthController } from "@/modules/auth/auth.controller";
import { loginSchema, registerSchema } from "@/modules/auth/auth.validator";
import { Router } from "express";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh", authenticate(), AuthController.refresh);
router.post("/logout", authenticate(), AuthController.logout);

export default router;
