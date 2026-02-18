import type { OpenAPIV3 } from "openapi-types";

export type GeneratedEndpoint = {
  path: string;
  method: Uppercase<
    Extract<
      keyof OpenAPIV3.PathItemObject,
      "get" | "post" | "put" | "delete" | "patch" | "options" | "head"
    >
  >;
  description?: string;
};

const HTTP_METHODS = [
  "get",
  "post",
  "put",
  "delete",
  "patch",
  "options",
  "head",
] as const;

type HttpMethod = (typeof HTTP_METHODS)[number];

export const generateEndpoints = (
  paths: OpenAPIV3.PathsObject,
): GeneratedEndpoint[] => {
  const endpoints: GeneratedEndpoint[] = [];

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!pathItem) continue;

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method as HttpMethod];

      if (!operation) continue;

      endpoints.push({
        path,
        method: method.toUpperCase() as GeneratedEndpoint["method"],
        description: operation.summary || operation.description,
      });
    }
  }

  return endpoints;
};
