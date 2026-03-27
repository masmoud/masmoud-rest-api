import { OpenAPIV3 } from "openapi-types";
import { swaggerComponents } from "../../swagger.components";
import { authPaths } from "./auth/auth.paths";
import { authSchemas } from "./auth/auth.schemas";
import { systemPaths } from "./system/system.paths";
import { systemSchemas } from "./system/system.schemas";
import { userPaths } from "./user/user.paths";
import { userSchemas } from "./user/user.schemas";

// Merge all route paths.
const paths: OpenAPIV3.PathsObject = {
  ...authPaths,
  ...userPaths,
  ...systemPaths,
};

// Merge all component schemas.
const schemas: OpenAPIV3.ComponentsObject["schemas"] = {
  ...authSchemas,
  ...userSchemas,
  ...systemSchemas,
};

// Tags used by Swagger UI.
const tags: OpenAPIV3.TagObject[] = [
  { name: "Auth", description: "Authentication endpoints" },
  { name: "Admin", description: "Admin-only endpoints" },
  { name: "Users", description: "User management endpoints" },
  { name: "System", description: "Health and system endpoints" },
];

// OpenAPI document.
export const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "Boilerplate API",
    version: "v1",
    description:
      "Full API documentation with JWT authentication and refresh token support.",
  },
  servers: [
    { url: "http://localhost:3000/api/v1", description: "Local development" },
  ],
  tags,
  paths,
  components: {
    ...swaggerComponents,
    schemas,
  },
  security: [], // Defaults to no auth; protected routes define their own requirements.
  externalDocs: {
    description: "Example JWT usage",
    url: "https://jwt.io/",
  },
};

// Swagger UI options.
export const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true, // Keep token after page reload.
    docExpansion: "list", // Collapse endpoints by default.
    defaultModelsExpandDepth: -1, // Hide schemas by default.
  },
};
