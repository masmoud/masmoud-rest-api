import app from "./app";
import { connectDB, gracefulShutdown } from "./config/db";
import { BASE_URL, env } from "./config/env";
import { logger } from "./config/logger";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    const serverUrl = `http://localhost:${env.PORT}`;

    const URL = env.NODE_ENV === "production" ? BASE_URL : serverUrl;

    logger.info(`Server running on ${URL}`);
  });

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

startServer();
