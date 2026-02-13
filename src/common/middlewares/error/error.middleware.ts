import { NextFunction, Request, Response } from "express";
import { serverConfig } from "../../../config/env";
import { AppError } from "../../utils/errors";
import { errorLogger } from "../../utils/logger";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error =
    err instanceof AppError ? err : (
      new AppError("Internal Server Error", 500, false)
    );

  errorLogger.error(error.message, {
    statusCode: error.statusCode,
    stack: serverConfig.nodeEnv === "development" ? error.stack : undefined,
  });

  res.status(error.statusCode).json({
    success: false,
    message: error.isOperational ? error.message : "Something went wrong",
    ...(error.details && typeof error.details === "object" ?
      { errors: error.details }
    : {}),
    ...(serverConfig.nodeEnv === "development" && { stack: error.stack }),
  });
};
