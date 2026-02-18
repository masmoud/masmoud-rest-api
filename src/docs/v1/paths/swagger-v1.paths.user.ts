import { OpenAPIV3 } from "openapi-types";

export const userPaths: OpenAPIV3.PathsObject = {
  "/users/profile": {
    get: {
      tags: ["Users"],
      summary: "Get authenticated user profile",
      description: "Returns the profile of the currently authenticated user.",
      responses: {
        "200": {
          description: "User profile retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: { $ref: "#/components/schemas/User" },
                },
                required: ["user"],
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
      },
    },
  },

  "/users": {
    get: {
      tags: ["Users"],
      summary: "List all users",
      description: "Returns all users. Admin role required.",
      responses: {
        "200": {
          description: "Users list retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserListResponse" },
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
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": {
          description: "User retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": { description: "User not found" },
      },
    },

    put: {
      tags: ["Users"],
      summary: "Update user",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
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
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User updated successfully",
                  },
                  user: { $ref: "#/components/schemas/User" },
                },
                required: ["message", "user"],
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": { description: "User not found" },
      },
    },

    delete: {
      tags: ["Users"],
      summary: "Delete user",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": {
          description: "User deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User deleted successfully",
                  },
                  userId: { type: "string", example: "6412a3b4c5d6e7f8g9h0" },
                },
                required: ["message", "userId"],
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "404": { description: "User not found" },
      },
    },
  },
};
