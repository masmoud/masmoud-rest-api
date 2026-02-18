import { OpenAPIV3 } from "openapi-types";

export const systemPaths: OpenAPIV3.PathsObject = {
  "/system/health": {
    get: {
      tags: ["System"],
      summary: "Health Check",
      description: "Checks if the server is running and responsive.",
      responses: {
        "200": {
          description: "Server is healthy",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "ok" },
                  timestamp: { type: "string", format: "date-time" },
                },
                required: ["status", "timestamp"],
              },
            },
          },
        },
      },
    },
  },

  "/system/ready": {
    get: {
      tags: ["System"],
      summary: "Readiness Check",
      description:
        "Checks if all critical dependencies are ready (DB, cache, etc.).",
      responses: {
        "200": {
          description: "System is ready",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "ready" },
                  timestamp: { type: "string", format: "date-time" },
                  dependencies: {
                    type: "object",
                    properties: {
                      db: { type: "boolean", example: true },
                    },
                  },
                },
                required: ["status", "timestamp", "dependencies"],
              },
            },
          },
        },
        "503": {
          description: "System not ready",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "not ready" },
                  timestamp: { type: "string", format: "date-time" },
                  dependencies: {
                    type: "object",
                    properties: {
                      db: { type: "boolean", example: false },
                    },
                  },
                },
                required: ["status", "timestamp", "dependencies"],
              },
            },
          },
        },
      },
    },
  },
};
