import { OpenAPIV3 } from "openapi-types";

export const userSchemas: { [key: string]: OpenAPIV3.SchemaObject } = {
  User: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", example: "6412a3b4c5d6e7f8g9h0" },
      firstName: { type: "string", example: "Ada" },
      lastName: { type: "string", example: "Lovelace" },
    },
  },

  UpdateUserInput: {
    type: "object",
    properties: {
      firstName: { type: "string", example: "Ada" },
      lastName: { type: "string", example: "Lovelace" },
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
        type: "array",
        items: { $ref: "#/components/schemas/User" },
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
