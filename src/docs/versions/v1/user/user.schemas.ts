import { OpenAPIV3 } from "openapi-types";

export const userSchemas: { [key: string]: OpenAPIV3.SchemaObject } = {
  User: {
    type: "object",
    required: ["id", "email"],
    properties: {
      id: { type: "string", example: "6412a3b4c5d6e7f8g9h0" },
      firstName: { type: "string", example: "Ada" },
      lastName: { type: "string", example: "Lovelace" },
      email: { type: "string", format: "email", example: "ada@example.com" },
    },
  },

  UpdateUserInput: {
    type: "object",
    properties: {
      firstName: { type: "string", example: "Ada" },
      lastName: { type: "string", example: "Lovelace" },
      email: { type: "string", format: "email", example: "ada@example.com" },
    },
  },

  PaginationMeta: {
    type: "object",
    required: ["totalItems", "totalPages", "currentPage", "hasNextPage", "hasPrevPage"],
    properties: {
      totalItems: { type: "integer", example: 42 },
      totalPages: { type: "integer", example: 5 },
      currentPage: { type: "integer", example: 1 },
      hasNextPage: { type: "boolean", example: true },
      hasPrevPage: { type: "boolean", example: false },
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
        required: ["users", "pagination"],
        properties: {
          users: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
          pagination: { $ref: "#/components/schemas/PaginationMeta" },
        },
      },
    },
  },

  ApiResponseUserDelete: {
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
