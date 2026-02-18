import type { OpenAPIV3 } from "openapi-types";
import { generateEndpoints } from "./generate-endpoints";

export const buildVersionDocs = (doc: OpenAPIV3.Document) => ({
  doc,
  endpoints: generateEndpoints(doc.paths),
});
