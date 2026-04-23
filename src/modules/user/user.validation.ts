import { z } from "zod";

const optionalNameField = (fieldName: string) =>
  z.string().trim().max(50, `${fieldName} too long`).optional();

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

export const UpdateUserSchema = z
  .object({
    firstName: optionalNameField("First name"),
    lastName: optionalNameField("Last name"),
    email: z.string().trim().email("Invalid email address").optional(),
  })
  .strict();

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
