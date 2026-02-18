import { Role, RoleArray } from "@/common/types";
import { z } from "zod";

// --- Schéma pour création / mise à jour utilisateur ---
export const createUserSchema = z.object({
  email: z.email("Invald email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(RoleArray).default(Role.USER),
});

export const updateUserSchema = z.object({
  email: z.email("Invalid email").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  role: z.enum(RoleArray).optional(),
});
