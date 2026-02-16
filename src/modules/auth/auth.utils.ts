import { UnauthorizedError } from "@/common/utils";
import { Request } from "express";

export const requireUser = (req: Request) => {
  if (!req.user) {
    throw UnauthorizedError("User not authenticated");
  }
  return req.user;
};
