import { ApiOverview } from "@/common/types";
import { config } from "@/config";
import { docs } from "@/docs";
import { Request, Response, Router } from "express";
import { system } from "./system";
import { v1Router } from "./v1";

const router = Router();

const serviceStartTime = Date.now();

// List of API versions
const apiOverview: ApiOverview = {
  service: "Boilerplate API",
  environment: config.server.nodeEnv,
  uptime: process.uptime(),
  versions: Object.entries(docs).map(([version, value]) => ({
    version,
    url: `/api/${version}`,
    endpoints: value.endpoints.length,
    status: "stable",
    description:
      "First stable version of the API. Supports authentication, JWT, user management.",
  })),
};

// --- API versions ---
router.use("/v1", v1Router.api);
router.use("/v1/auth", v1Router.auth);
router.use("/v1/users", v1Router.user);
router.use("/v1/docs", v1Router.swagger);

// --- System routes ---
router.use("/system", system.main);

router.get("/", (_req: Request, res: Response) => {
  res.json(apiOverview);
});

export default router;
