import { config } from "@/config/env.config";
import { Response } from "express";

const baseCookieOptions = {
  httpOnly: true,
  secure: config.server.nodeEnv === "production",
  sameSite: "strict" as const,
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie("accessToken", accessToken, {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);
};

export const parseJwtExpiry = (expiry: string | number): number => {
  if (typeof expiry === "number") return expiry;

  const match = expiry.match(/^(\d+)([smhdwy])$/);
  if (!match) return 0;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
    w: 1000 * 60 * 60 * 24 * 7,
    y: 1000 * 60 * 60 * 24 * 365,
  };

  return value * (multipliers[unit] ?? 1);
};

export const authCookies = Object.freeze({
  set: setAuthCookies,
  clear: clearAuthCookies,
});
