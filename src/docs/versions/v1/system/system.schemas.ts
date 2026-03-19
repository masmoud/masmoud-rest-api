import { OpenAPIV3 } from "openapi-types";

export const systemSchemas: { [key: string]: OpenAPIV3.SchemaObject } = {
  HealthResponse: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", example: "ok" },
    },
  },
  ReadinessResponse: {
    type: "object",
    required: ["db"],
    properties: {
      db: { type: "boolean", example: true },
    },
  },
};
