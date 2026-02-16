import { z } from "zod";
import { Role } from "./user.types";

// --- Schéma pour création / mise à jour utilisateur ---
export const createUserSchema = z.object({
  email: z.email("Invald email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(Object.values(Role)).default(Role.USER),
});

export const updateUserSchema = z.object({
  email: z.email("Invalid email").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  role: z.enum(Object.values(Role)).optional(),
});
