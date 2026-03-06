import { swaggerDocV1 } from "@/docs/v1/swagger-v1.docs";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocV1));

export default router;
