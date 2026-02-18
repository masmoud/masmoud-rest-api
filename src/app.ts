import cookieParser from "cookie-parser";
import express, { Application } from "express";
import {
  errorHandler,
  notFound,
  requestLogger,
  securityMiddleware,
} from "./common/middlewares";
import { compressionConfig } from "./config/compression.config";
import apiIndexRouter from "./routes/api-index.routes";
export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(compressionConfig);
    this.app.use(requestLogger);
    this.app.use(securityMiddleware);
  }

  private routes() {
    this.app.use("/api", apiIndexRouter);
    this.app.use(notFound);
    this.app.use(errorHandler);
  }
}
