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

  AuthLoginResponse: {
    type: "object",
    required: ["user", "accessToken"],
    properties: {
      user: { $ref: "#/components/schemas/User" },
      accessToken: { type: "string", example: "jwt.access.token" },
    },
  },

  AuthRegisterResponse: {
    type: "object",
    required: ["user", "accessToken"],
    properties: {
      user: {
        type: "object",
        required: ["id", "authId"],
        properties: {
          id: { type: "string", example: "64f1c7b2a3f12a1234567890" },
          authId: { type: "string", example: "64f1c7b2a3f12a1234567890" },
        },
      },
      accessToken: { type: "string", example: "jwt.access.token" },
    },
  },

  ApiResponseAuthLogin: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "User logged in successfully" },
      data: { $ref: "#/components/schemas/AuthLoginResponse" },
    },
  },

  ApiResponseAuthRegister: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
      data: { $ref: "#/components/schemas/AuthRegisterResponse" },
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
          accessToken: { type: "string", example: "jwt.access.token" },
        },
        required: ["accessToken"],
      },
    },
  },

  ApiResponseAuthLogout: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Logged out successfully" },
      data: {
        type: "object",
        properties: {
          userId: { type: "string", example: "64f1c7b2a3f12a1234567890" },
        },
        required: ["userId"],
      },
    },
  },

  ApiResponseAuthAdminRegister: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
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
