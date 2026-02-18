import { App } from "./app";
import { logs } from "@/common/utils";
import { db } from "@/config/db.config";
import { config } from "@/config/env.config";

const appInstance = new App();

// Service start time for uptime monitoring
const serviceStartTime = Date.now();

const startServer = async () => {
  try {
    // --- Connect to database ---
    await db.connect();

    // --- Start server ---
    const server = appInstance.app.listen(config.server.port, () => {
      const baseURL =
        config.server.nodeEnv === "production" ?
          config.server.baseUrl
        : `http://localhost:${config.server.port}/api`;

      logs.main.info(`----------------------------------------`);
      logs.main.info(`Service: Boilerplate API`);
      logs.main.info(`Environment: ${config.server.nodeEnv}`);
      logs.main.info(`API base URL: ${baseURL}`);
      logs.main.info(`API v1: ${baseURL}/v1`);
      logs.main.info(`Swagger docs: ${baseURL}/v1/docs`);
      logs.main.info(`----------------------------------------`);
    });

    // --- Graceful shutdown for signals ---
    const shutdownHandler = async (signal: string) => {
      logs.main.info(`Received ${signal}. Initiating graceful shutdown...`);

      server.close(async (err) => {
        if (err) {
          logs.main.error(`Error closing server: ${err.message}`);
          process.exit(1);
        }

        await db.shutdown(signal);

        const uptimeSec = Math.floor((Date.now() - serviceStartTime) / 1000);
        logs.main.info(`Server stopped. Uptime: ${uptimeSec}s`);
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdownHandler("SIGINT"));
    process.on("SIGTERM", () => shutdownHandler("SIGTERM"));

    // --- Catch uncaught exceptions and unhandled rejections ---
    process.on("uncaughtException", (err) => {
      logs.main.error(`Uncaught Exception: ${err.message}`);
      logs.main.error(err.stack);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason: any) => {
      logs.main.error(`Unhandled Rejection: ${reason}`);
      process.exit(1);
    });
  } catch (error: any) {
    logs.main.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// --- Start the server ---
startServer();
