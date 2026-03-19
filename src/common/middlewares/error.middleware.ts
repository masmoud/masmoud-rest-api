import { config } from "@/config/env.config";
import { NextFunction, Request, Response } from "express";
import { logs } from "../logger/pino-logger";
import { AppError } from "../utils/errors";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const appError =
    err instanceof AppError ? err : new AppError("Internal Server Error", 500);

  const { statusCode, message, code, details } = appError;

  logs.error.error({
    requestId: req.headers["x-request-id"] || req.requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message,
    code,
    stack: config.server.nodeEnv === "development" ? appError.stack : undefined,
    details,
  });

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(config.server.nodeEnv !== "production" ? { details } : {}),
  });
};
