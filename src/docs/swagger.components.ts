import { OpenAPIV3 } from "openapi-types";

export const swaggerComponents: OpenAPIV3.ComponentsObject = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description:
        "Paste your JWT access token here to authorize protected endpoints",
    },
  },
};
