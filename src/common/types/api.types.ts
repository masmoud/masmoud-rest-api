import { OpenAPIV3 } from "openapi-types";

export type ApiVersionInfo = {
  version: string;
  url: string;
  status: "stable" | "beta" | "deprecated";
  description?: string;
};

export type ApiOverview = {
  service: string;
  environment: string;
  uptime: number;
  versions: ApiVersionInfo[];
};

export type ApiEndpoint = {
  path: string;
  method: Uppercase<keyof OpenAPIV3.PathItemObject>;
  description?: string;
};

export type ApiV1Detail = {
  version: string;
  status: "stable" | "beta" | "deprecated";
  description?: string;
  features: string[];
  endpoints: ApiEndpoint[];
};
