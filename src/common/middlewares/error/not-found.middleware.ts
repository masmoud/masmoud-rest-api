import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../utils/errors";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(NotFoundError(`Route ${req.originalUrl} not found`));
};
