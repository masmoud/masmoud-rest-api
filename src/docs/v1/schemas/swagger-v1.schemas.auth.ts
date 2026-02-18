import { OpenAPIV3 } from "openapi-types";

export const authSchemas: { [key: string]: OpenAPIV3.SchemaObject } = {
  LoginInput: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", example: "user@mail.com" },
      password: { type: "string", example: "password123" },
    },
  },

  RegisterInput: {
    type: "object",
    required: ["email", "password", "role"],
    properties: {
      email: { type: "string", example: "user@mail.com" },
      password: { type: "string", example: "password123" },
      role: { type: "string", example: "USER" },
    },
  },

  AuthResponse: {
    type: "object",
    required: ["user", "accessToken"],
    properties: {
      user: { $ref: "#/components/schemas/User" },
      accessToken: { type: "string", example: "jwt.access.token" },
    },
  },
};
