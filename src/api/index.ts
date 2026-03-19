import { ApiOverview } from "@/common/types";
import { config } from "@/config";

import { Request, Response, Router } from "express";
import v1Routes from "./v1/routes";
import { swaggerVersions } from "@/docs";

const router = Router();

const serviceStartTime = Date.now();

// --- API versions overview ---
const apiOverview: ApiOverview = {
  service: "Boilerplate API",
  environment: config.server.nodeEnv,
  serviceStartTime: new Date(serviceStartTime).toISOString(),
  versions: Object.entries(swaggerVersions).map(([version, doc]) => ({
    version,
    url: `/${version}`,
    endpoints: doc.endpoints.length,
    status: "stable",
    description:
      "First stable version of the API. Supports authentication, JWT, user management.",
  })),
};

// --- API versions ---
router.use("/v1", v1Routes);

router.get("/", (_req: Request, res: Response) => {
  res.json({
    ...apiOverview,
    uptime: process.uptime(),
  });
});

export default router;
