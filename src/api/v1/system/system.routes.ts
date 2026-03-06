// src/routes/system/system.routes.ts
import { logs } from "@/common/utils";
import { db } from "@/config";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/ready", (_req: Request, res: Response, next: NextFunction) => {
  try {
    const dbStatus = db.getStatus();
    const ready = dbStatus;

    if (!ready) {
      logs.http.warn("Readiness check failed: dependencies not ready");
      return res.status(503).json({
        status: "not ready",
        timestamp: new Date().toISOString(),
        dependencies: {
          db: dbStatus,
        },
      });
    }

    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
      dependencies: {
        db: dbStatus,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
