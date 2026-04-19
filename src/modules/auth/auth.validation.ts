import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strict();

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Authentication response schema.
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: z.object({
      id: z.string(),
      authId: z.string(),
    }),
    accessToken: z.string(),
  }),
});

// Refresh response schema.
export const RefreshResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
  }),
});

// Logout response schema.
export const LogoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
