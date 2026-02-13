import app from "./app";
import { logger } from "./common/utils";
import { connectDB, gracefulShutdown } from "./config/db";
import { serverConfig } from "./config/env";

const startServer = async () => {
  await connectDB();

  app.listen(serverConfig.port, () => {
    const URL =
      serverConfig.nodeEnv === "production" ?
        serverConfig.baseUrl
      : `http://localhost:${serverConfig.port}/api`;

    logger.info(`Server running on ${URL}`);
    logger.info(`API v1 running on ${URL}/v1`);
  });

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

startServer();
