import apiV1Routes from "./api-v1.routes";
import authRoutes from "./auth.routes";
import swaggerRoutes from "./swagger.routes";
import userRoutes from "./user.routes";

export const v1Router = {
  auth: authRoutes,
  user: userRoutes,
  swagger: swaggerRoutes,
  api: apiV1Routes,
};
