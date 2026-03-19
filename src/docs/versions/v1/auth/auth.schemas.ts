import { OpenAPIV3 } from "openapi-types";

export const authSchemas: { [key: string]: OpenAPIV3.SchemaObject } = {
  LoginInput: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", example: "user@mail.com" },
      password: { type: "string", format: "password", example: "password123" },
    },
  },

  RegisterInput: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", example: "user@mail.com" },
      password: { type: "string", format: "password", example: "password123" },
    },
  },

  AdminRegisterInput: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", example: "admin@mail.com" },
      password: {
        type: "string",
        format: "password",
        example: "securePassword123",
      },
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

  ApiResponseAuth: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "User logged in successfully" },
      data: { $ref: "#/components/schemas/AuthResponse" },
    },
  },

  ApiResponseRefresh: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Token refresh successful" },
      data: {
        type: "object",
        properties: {
          message: { type: "string", example: "Token refreshed" },
          accessToken: { type: "string", example: "jwt.access.token" },
        },
        required: ["accessToken"],
      },
    },
  },

  ApiResponseMessage: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Logged out successfully" },
      data: {
        type: "object",
        properties: {
          message: { type: "string", example: "Logged out successfully" },
        },
        required: ["message"],
      },
    },
  },

  ApiResponseAdmin: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Admin user created successfully" },
      data: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "string", example: "64f1c7b2a3f12a1234567890" },
              authId: { type: "string", example: "64f1c7b2a3f12a1234567890" },
            },
            required: ["id", "authId"],
          },
        },
        required: ["user"],
      },
    },
  },
};
