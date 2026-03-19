import cookieParser from "cookie-parser";
import express, { Application } from "express";
import apiRouter from "./api";
import {
  errorHandler,
  httpLogger,
  notFound,
  requestIdMiddleware,
  securityMiddleware,
} from "./common/middlewares";
import { compressionConfig } from "./config/compression.config";
export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(requestIdMiddleware);
    this.app.use(httpLogger);
    this.app.use(securityMiddleware);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(compressionConfig);
  }

  private routes() {
    this.app.use("/api", apiRouter);
    this.app.use(notFound);
    this.app.use(errorHandler);
  }
}

export const appInstance = new App();
