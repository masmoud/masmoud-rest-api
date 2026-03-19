import { swaggerDocument, swaggerOptions } from "@/docs/versions/v1/swagger.v1";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);

export default router;
