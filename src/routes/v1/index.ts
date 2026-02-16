import { Router } from "express";
import authRoutes from "./auth.routes";
import rootRoutes from "./root.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/", rootRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
