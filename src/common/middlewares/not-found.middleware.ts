import { errors } from "@/common/utils";
import { NextFunction, Request, Response } from "express";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(errors.NotFound(`Route ${req.originalUrl} not found`));
};
