import { Router } from "express";
import healthRoutes from "./health.routes";
import readinessRoutes from "./readiness.routes";

const router = Router();

router.use("/", healthRoutes);
router.use("/", readinessRoutes);

export default router;
