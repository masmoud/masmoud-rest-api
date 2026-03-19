import { buildVersionDocs } from "@/docs/utils/build-version";
import { swaggerDocument } from "./swagger.v1";

export const swaggerV1 = buildVersionDocs(swaggerDocument);
