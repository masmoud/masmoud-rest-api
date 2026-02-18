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

  UserListResponse: {
    type: "object",
    required: ["users"],
    properties: {
      users: {
        type: "array",
        items: { $ref: "#/components/schemas/User" },
      },
    },
  },

  UpdateUserInput: {
    type: "object",
    properties: {
      email: { type: "string", example: "newuser@mail.com" },
      role: { type: "string", example: "ADMIN" },
    },
  },
};
