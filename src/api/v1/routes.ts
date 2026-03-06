import { ApiV1Detail } from "@/common/types";
import { docs } from "@/docs";
import { AuthV1 } from "@/modules/v1/auth";
import { UserV1 } from "@/modules/v1/user";
import { Router } from "express";
import swaggerRoutes from "./swagger/swagger.routes";
import systemRoutes from "./system/system.routes";

const router = Router();

const v1 = docs.v1;
const apiV1: ApiV1Detail = {
  version: "v1",
  status: "stable",
  description: v1.doc.info.description,
  features: [
    "Authentication (register, login, logout, refresh tokens)",
    "User management (CRUD for users, profile)",
    "JWT access + refresh tokens",
    "Health and readiness endpoints",
  ],
  endpoints: v1.endpoints,
};

router.use("/", systemRoutes);
router.use("/auth", AuthV1.routes);
router.use("/users", UserV1.routes);
router.use("/docs", swaggerRoutes);

router.get("/", (_req, res) => {
  res.json(apiV1);
});

export default router;
