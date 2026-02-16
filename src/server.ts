import { App } from "./app";
import { logger } from "./common/utils";
import { connectDB, gracefulShutdown } from "./config/db";
import { config } from "./config/env";

const appInstance = new App();

const startServer = async () => {
  await connectDB();

  appInstance.app.listen(config.server.port, () => {
    const URL =
      config.server.nodeEnv === "production" ?
        config.server.baseUrl
      : `http://localhost:${config.server.port}/api`;

    logger.info(`Server running on ${URL}`);
    logger.info(`API v1 running on ${URL}/v1`);
  });

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

startServer();
