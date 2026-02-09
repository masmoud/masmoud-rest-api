import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";

export const requestLogger = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};
