import cookieParser from "cookie-parser";
import express, { Application } from "express";
import * as mw from "./common/middlewares";
import { compressionConfig } from "./config/compression";
import { v1Routes } from "./routes";
import apiIndexRouter from "./routes/api-index";

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
    this.app.use(mw.requestLogger);
    this.app.use(mw.securityMiddleware);
  }

  private routes() {
    this.app.use("/api", apiIndexRouter);
    this.app.use("/api/v1", v1Routes);
    this.app.use(mw.notFound);
    this.app.use(mw.errorHandler);
  }
}
