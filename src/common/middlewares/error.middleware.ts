import { config } from "@/config/env.config";
import { NextFunction, Request, Response } from "express";
import { logs } from "../utils";
import { AppError } from "../utils/errors.utils";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error =
    err instanceof AppError ? err : (
      new AppError(
        err instanceof Error ? err.message : "Internal Server Error",
        500,
      )
    );

  logs.error.error(error.message, {
    statusCode: error.statusCode,
    stack: config.server.nodeEnv === "development" ? error.stack : undefined,
  });

  const response: Record<string, any> = {
    success: false,
    message: error.message,
  };

  if (error.details) response.errors = error.message;

  if (config.server.nodeEnv === "development") response.stack = error.stack;

  res.status(error.statusCode).json(response);
};
