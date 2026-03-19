import { Role } from "@/common/types";
import { z } from "zod";

// --- Schéma pour création / mise à jour utilisateur ---
export const UserSchema = z.object({
  email: z.email("Invald email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(Object.values(Role)).default(Role.USER),
});

export const UpdateUserSchema = z.object({
  email: z.email("Invalid email").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  role: z.enum(Object.values(Role)).optional(),
});

export const UserResponseSchema = z.object({
  user: UserSchema,
});

export const UserListResponseSchema = z.object({
  users: z.array(UserSchema),
});

export const UserIdResponseSchema = z.object({
  userId: z.string(),
});

export type UserInput = z.infer<typeof UserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
