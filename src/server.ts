import app from "./app";
import { connectDB, gracefulShutdown } from "./config/db";
import { serverConfig } from "./config/env";
import { logger } from "./config/logger";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    const URL =
      serverConfig.nodeEnv === "production" ?
        serverConfig.baseUrl
      : `http://localhost:${serverConfig.port}`;

    logger.info(`Server running on ${URL}`);
  });

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

startServer();
