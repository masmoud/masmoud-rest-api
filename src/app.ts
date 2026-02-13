import cookieParser from "cookie-parser";
import express from "express";
import * as mw from "./common/middlewares";
import { compressionConfig } from "./config/compression";
import { v1Routes } from "./routes";
import apiIndexRouter from "./routes/api-index";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compressionConfig);

app.use(mw.requestLogger);
app.use(mw.securityMiddleware);

// API version index
app.use("/api", apiIndexRouter);

// Mount versioned routes
app.use("/api/v1", v1Routes);

app.use(mw.notFound);
app.use(mw.errorHandler);

export default app;
