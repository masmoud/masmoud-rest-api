import { OpenAPIV3 } from "openapi-types";

export const userSchemas: { [key: string]: OpenAPIV3.SchemaObject } = {
  User: {
    type: "object",
    required: ["id", "email", "role"],
    properties: {
      id: { type: "string", example: "6412a3b4c5d6e7f8g9h0" },
      email: { type: "string", example: "user@mail.com" },
      role: { type: "string", example: "USER" },
    },
  },

  UpdateUserInput: {
    type: "object",
    properties: {
      email: { type: "string", example: "newuser@mail.com" },
      role: { type: "string", example: "ADMIN" },
    },
  },

  ApiResponseUser: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Profile fetched" },
      data: { $ref: "#/components/schemas/User" },
    },
  },

  ApiResponseUserList: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Users fetched" },
      data: {
        type: "object",
        properties: {
          users: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
        },
        required: ["users"],
      },
    },
  },

  ApiResponseMessage: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "User deleted successfully" },
      data: {
        type: "object",
        properties: {
          userId: { type: "string", example: "6412a3b4c5d6e7f8g9h0" },
        },
        required: ["userId"],
      },
    },
  },
};
