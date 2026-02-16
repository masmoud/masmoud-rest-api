import { hashToken, signRefreshToken, UnauthorizedError } from "@/common/utils";
import { Request } from "express";

export const requireUser = (req: Request) => {
  if (!req.user) {
    throw UnauthorizedError("User not authenticated");
  }
  return req.user;
};

export function generateRefreshTokenPair(userId: string) {
  const refreshToken = signRefreshToken({
    sub: userId,
  });

  const hashedRefreshToken = hashToken(refreshToken);

  return {
    refreshToken,
    hashedRefreshToken,
  };
}
