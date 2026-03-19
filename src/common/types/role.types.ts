import { z } from "zod";

export const roles = ["user", "admin"] as const;

export type RoleType = (typeof roles)[number];

export const roleSchema = z.enum(roles);

export const Role = Object.freeze({
  USER: "user",
  ADMIN: "admin",
}) satisfies Record<string, RoleType>;
