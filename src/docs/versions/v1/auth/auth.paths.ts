import { OpenAPIV3 } from "openapi-types";

export const authPaths: OpenAPIV3.PathsObject = {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      security: [],
      description: "Creates a new user account and returns an access token.",
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
              schema: { $ref: "#/components/schemas/ApiResponseAuth" },
            },
          },
        },
        "400": { description: "Invalid input or email already exists" },
        "403": {
          description: "Admin emails cannot register via public endpoint",
        },
      },
    },
  },

  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      security: [],
      description: "Authenticates a user and returns an access token.",
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
              schema: { $ref: "#/components/schemas/ApiResponseAuth" },
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
      security: [],
      description:
        "Uses the refresh token stored in HTTP-only cookie to issue a new access token.",
      responses: {
        "200": {
          description: "Token refreshed successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseRefresh" },
            },
          },
        },
        "401": { description: "Invalid or expired refresh token" },
      },
    },
  },

  "/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout user",
      security: [],
      description:
        "Logs out the user and invalidates the refresh token stored in cookies.",
      responses: {
        "200": {
          description: "User successfully logged out",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseMessage" },
            },
          },
        },
        "401": { description: "Unauthorized" },
      },
    },
  },

  "/auth/admin/register": {
    post: {
      tags: ["Admin"],
      summary: "Register a new admin",
      description:
        "Creates a new admin account. Requires a valid JWT access token with ADMIN role.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AdminRegisterInput" },
          },
        },
      },
      responses: {
        "201": {
          description: "Admin successfully created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseAdmin" },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "403": { description: "Only admins can create new admins" },
      },
    },
  },
};
