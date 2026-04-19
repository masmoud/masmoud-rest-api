import { db } from "@/config/db.config";
import { config } from "@/config/env.config";
import { appInstance } from "./app";
import { logs } from "./common/logger/pino-logger";
import { seedAdmins } from "./modules/user/seed-admins";

// Track service start time for uptime reporting.
const serviceStartTime = Date.now();

// Register process-level error handlers before anything else so errors during
// startup are also caught.
process.on("uncaughtException", (err) => {
  logs.server.error(`Uncaught Exception: ${err.message}`);
  logs.server.error(err.stack ?? "");
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  logs.server.error(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

const startServer = async () => {
  try {
    await db.connect();
    await seedAdmins();

    const { app } = appInstance;

    const server = app.listen(config.server.port, () => {
      const baseURL =
        config.server.nodeEnv === "production" ?
          config.server.baseUrl
        : `http://localhost:${config.server.port}/api`;

      logs.server.info(`----------------------------------------`);
      logs.server.info(`Service: Boilerplate API`);
      logs.server.info(`Environment: ${config.server.nodeEnv}`);
      logs.server.info(`API base URL: ${baseURL}`);
      logs.server.info(`API v1: ${baseURL}/v1`);
      logs.server.info(`Swagger docs: ${baseURL}/v1/docs`);
      logs.server.info(`----------------------------------------`);
    });

    /** Stops the HTTP server, disconnects from the DB, then exits cleanly. */
    const shutdownHandler = async (signal: string) => {
      logs.server.info(`Received ${signal}. Initiating graceful shutdown...`);

      server.close(async (err) => {
        if (err) {
          logs.server.error(`Error closing server: ${err.message}`);
          process.exit(1);
        }

        await db.disconnect();

        const uptimeSec = Math.floor((Date.now() - serviceStartTime) / 1000);
        logs.server.info(`Server stopped. Uptime: ${uptimeSec}s`);
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdownHandler("SIGINT"));
    process.on("SIGTERM", () => shutdownHandler("SIGTERM"));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logs.server.error(`Failed to start server: ${message}`);
    process.exit(1);
  }
};

startServer();
