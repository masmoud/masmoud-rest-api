import { buildVersionDocs } from "./utils/build-version";
import { swaggerDocV1 } from "./v1/swagger-v1.docs";

export const docs = {
  v1: buildVersionDocs(swaggerDocV1),
} as const;

export type ApiDocs = typeof docs;
