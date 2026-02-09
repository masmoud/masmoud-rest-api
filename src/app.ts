import express, { NextFunction, Request, Response } from "express";
import { logger } from "./config/logger";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { securityMiddleware } from "./middlewares/security.middleware";

const app = express();

app.use(securityMiddleware);
app.use(express.json());
app.use(requestLogger);

// Middleware de logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/", (_req, res) => {
  logger.info("GET / endpoint hit");
  res.send("API running...");
});

export default app;
