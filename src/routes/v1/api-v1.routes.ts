import { ApiV1Detail } from "@/common/types";
import { docs } from "@/docs";
import { generateEndpoints } from "@/docs/utils/generate-endpoints";
import { swaggerDocV1 } from "@/docs/v1/swagger-v1.docs";
import { Router } from "express";

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

router.get("/", (_req, res) => {
  res.json(apiV1);
});

export default router;
