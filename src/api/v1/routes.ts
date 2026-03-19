import { ApiV1Detail } from "@/common/types";
import { swaggerVersions } from "@/docs";
import { authRoutesV1 } from "@/modules/auth/v1";
import { userRoutesV1 } from "@/modules/user/v1";
import { Router } from "express";
import swaggerRoutes from "./swagger/swagger.routes";
import systemRoutes from "./system";

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
router.use("/auth", authRoutesV1);
router.use("/users", userRoutesV1);
router.use("/docs", swaggerRoutes);

router.get("/", (_req, res) => {
  res.json(apiV1);
});

export default router;
