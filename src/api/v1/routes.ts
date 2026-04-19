import { ApiV1Detail } from "@/common/types";
import { authRepo, userManagementSvc, userRepo } from "@/context";
import { swaggerVersions } from "@/docs";
import { createAuthModule } from "@/modules/auth/v1/auth.module";
import { createUserModule } from "@/modules/user/v1/user.module";
import { Router } from "express";
import swaggerRoutes from "./swagger/swagger.routes";
import systemRoutes from "./system";

const authModule = createAuthModule({
  authRepository: authRepo,
  userRepository: userRepo,
});

const userModule = createUserModule({
  userRepository: userRepo,
  userManagementService: userManagementSvc,
});

const router = Router();

const apiV1: ApiV1Detail = {
  version: "v1",
  status: "stable",
  description: swaggerVersions.v1.doc.info.description,
  features: [
    "Authentication (register, login, logout, refresh tokens)",
    "User management (CRUD for users, profile)",
    "JWT access + refresh tokens",
    "Health and readiness endpoints",
  ],
  endpoints: swaggerVersions.v1.endpoints,
};

router.use("/system", systemRoutes);
router.use("/auth", authModule.router);
router.use("/users", userModule.router);
router.use("/docs", swaggerRoutes);

router.get("/", (_req, res) => {
  res.json(apiV1);
});

export default router;
