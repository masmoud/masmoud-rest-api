import { Role } from "@/common/types";
import { z } from "zod";

// --- Schéma pour création / mise à jour utilisateur ---
const createUserSchema = z.object({
  email: z.email("Invald email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(Object.values(Role)).default(Role.USER),
});

const updateUserSchema = z.object({
  email: z.email("Invalid email").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  role: z.enum(Object.values(Role)).optional(),
});

export const userSchemas = {
  create: createUserSchema,
  update: updateUserSchema,
} as const;
