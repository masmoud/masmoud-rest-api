import { NotFoundError } from "@/common/utils";
import { NextFunction, Request, Response } from "express";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(NotFoundError(`Route ${req.originalUrl} not found`));
};
