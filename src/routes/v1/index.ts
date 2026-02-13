import { Router } from "express";
import authRoutes from "./auth.routes";
import rootRoutes from "./root.routes";

const router = Router();

router.use("/", rootRoutes);
router.use("/auth", authRoutes);

export default router;
