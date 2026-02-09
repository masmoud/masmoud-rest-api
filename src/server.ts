import app from "./app";
import { connectDB, gracefulShutdown } from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT}`);
  });

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

startServer();
