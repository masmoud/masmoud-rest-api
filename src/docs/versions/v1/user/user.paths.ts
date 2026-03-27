import { OpenAPIV3 } from "openapi-types";

export const userPaths: OpenAPIV3.PathsObject = {
  "/users/profile": {
    get: {
      tags: ["Users"],
      summary: "Get authenticated user profile",
      security: [{ bearerAuth: [] }],
      description: "Returns the profile of the currently authenticated user.",
      responses: {
        "200": {
          description: "User profile retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseUser" },
            },
          },
        },
        "401": { description: "Unauthorized" },
      },
    },
    put: {
      tags: ["Users"],
      summary: "Update authenticated user profile",
      security: [{ bearerAuth: [] }],
      description: "Updates the profile of the currently authenticated user.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateUserInput" },
          },
        },
      },
      responses: {
        "200": {
          description: "User profile updated successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseUser" },
            },
          },
        },
        "400": { description: "Validation failed" },
        "401": { description: "Unauthorized" },
      },
    },
  },

  "/users": {
    get: {
      tags: ["Users"],
      summary: "List all users",
      security: [{ bearerAuth: [] }],
      description: "Returns all users. Admin role required.",
      responses: {
        "200": {
          description: "Users list retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseUserList" },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - Admin only" },
      },
    },
  },

  "/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get user by ID",
      security: [{ bearerAuth: [] }],
      description:
        "Returns a user by ID. Accessible by the user themself or an admin.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "User retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseUser" },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden" },
        "404": { description: "User not found" },
      },
    },

    put: {
      tags: ["Users"],
      summary: "Update user",
      security: [{ bearerAuth: [] }],
      description:
        "Updates a user by ID. Accessible by the user themself or an admin.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateUserInput" },
          },
        },
      },
      responses: {
        "200": {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseUser" },
            },
          },
        },
        "400": { description: "Validation failed" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden" },
        "404": { description: "User not found" },
      },
    },

    delete: {
      tags: ["Users"],
      summary: "Delete user",
      security: [{ bearerAuth: [] }],
      description:
        "Deletes a user by ID. Accessible by the user themself or an admin.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "User deleted successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseUserDelete" },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden" },
        "404": { description: "User not found" },
      },
    },
  },
};
