import express, { NextFunction, Request, Response } from "express";
import { httpLogger } from "./config/logger";
import { errorHandler } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { securityMiddleware } from "./middlewares/security";

const app = express();

app.use(securityMiddleware);
app.use(express.json());
app.use(requestLogger);

// Middleware de logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  httpLogger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/", (_req, res) => {
  httpLogger.info("GET / endpoint hit");
  res.send("API running...");
});

app.use(errorHandler);

export default app;
