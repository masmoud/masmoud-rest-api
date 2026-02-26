import { ApiV1Detail } from "@/common/types";
import { docs } from "@/docs";
import { Router } from "express";
import authRoutes from "./auth.routes";
import swaggerRoutes from "./swagger.routes";
import systemRoutes from "./system.routes";
import userRoutes from "./user.routes";

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
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/docs", swaggerRoutes);

router.get("/", (_req, res) => {
  res.json(apiV1);
});

export default router;
