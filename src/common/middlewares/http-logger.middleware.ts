import { NextFunction, Request, Response } from "express";
import { logs } from "../logger/pino-logger";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    const level =
      res.statusCode >= 500 ? "error"
      : res.statusCode >= 400 ? "warn"
      : "info";

    logs.http.info({
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    });
  });

  next();
};
