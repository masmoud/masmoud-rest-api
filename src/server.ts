import { db } from "@/config/db.config";
import { config } from "@/config/env.config";
import { appInstance } from "./app";
import { logs } from "./common/logger/pino-logger";
import { seedAdmins } from "./modules/user/seed-admins";

// Track service start time for uptime reporting.
const serviceStartTime = Date.now();

const startServer = async () => {
  try {
    // Connect to dependencies.
    await db.connect();
    await seedAdmins();

    // Start HTTP server.
    const server = appInstance.app.listen(config.server.port, () => {
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

    // Handle process shutdown signals.
    const shutdownHandler = async (signal: string) => {
      logs.db.info(`Received ${signal}. Initiating graceful shutdown...`);

      server.close(async (err) => {
        if (err) {
          logs.db.error(`Error closing server: ${err.message}`);
          process.exit(1);
        }

        await db.shutdown(signal);

        const uptimeSec = Math.floor((Date.now() - serviceStartTime) / 1000);
        logs.server.info(`Server stopped. Uptime: ${uptimeSec}s`);
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdownHandler("SIGINT"));
    process.on("SIGTERM", () => shutdownHandler("SIGTERM"));

    // Handle unexpected process-level errors.
    process.on("uncaughtException", (err) => {
      logs.db.error(`Uncaught Exception: ${err.message}`);
      logs.db.error(err.stack);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason: any) => {
      logs.db.error(`Unhandled Rejection: ${reason}`);
      process.exit(1);
    });
  } catch (error: any) {
    logs.db.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server.
startServer();
