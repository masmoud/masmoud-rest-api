import { OpenAPIV3 } from "openapi-types";
import { authPaths } from "./paths/swagger-v1.paths.auth";
import { systemPaths } from "./paths/swagger-v1.paths.system";
import { userPaths } from "./paths/swagger-v1.paths.user";
import { authSchemas } from "./schemas/swagger-v1.schemas.auth";
import { systemSchemas } from "./schemas/swagger-v1.schemas.system";
import { userSchemas } from "./schemas/swagger-v1.schemas.user";

export const swaggerDocV1: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "Boilerplate API v1",
    version: "1.0.0",
    description: "API documentation for Boilerplate project",
  },
  servers: [{ url: "/api/v1" }],
  components: {
    schemas: {
      ...userSchemas,
      ...authSchemas,
      ...systemSchemas,
    },
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  paths: {
    ...userPaths,
    ...authPaths,
    ...systemPaths,
  },
};
