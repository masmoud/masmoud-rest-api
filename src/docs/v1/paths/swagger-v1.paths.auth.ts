import { OpenAPIV3 } from "openapi-types";

export const authPaths: OpenAPIV3.PathsObject = {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      security: [], // public
      description: "Creates a new user and returns access + refresh tokens.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterInput" },
          },
        },
      },
      responses: {
        "201": {
          description: "User successfully registered",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
        "400": { description: "Email already in use" },
      },
    },
  },

  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      security: [], // public
      description: "Authenticates a user and returns access + refresh tokens.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginInput" },
          },
        },
      },
      responses: {
        "200": {
          description: "User successfully logged in",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
        "401": { description: "Invalid credentials" },
      },
    },
  },

  "/auth/refresh": {
    post: {
      tags: ["Auth"],
      summary: "Refresh access token",
      description:
        "Rotates refresh token and returns a new access token. Requires refresh token cookie.",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Token refreshed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { accessToken: { type: "string" } },
                required: ["accessToken"],
              },
            },
          },
        },
        "401": { description: "Invalid or reused refresh token" },
      },
    },
  },

  "/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout user",
      description: "Logs out user and invalidates the current refresh token.",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": { description: "Successfully logged out" },
        "401": { description: "Unauthorized" },
      },
    },
  },
};
