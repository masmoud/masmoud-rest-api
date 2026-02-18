import mongoose, { ConnectOptions } from "mongoose";
import { config } from "./env.config";
import { logs } from "@/common/utils";

const clientOptions: ConnectOptions = {
  dbName: "node-ts-express-boilerplate",
  appName: "Boilerplate API",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  autoIndex: true,
  autoCreate: true,
};

const status = {
  connected: false,
  listenersAttached: false,
};

export const db = Object.freeze({
  // Connect to MongoDB
  connect: async (): Promise<void> => {
    if (status.connected) {
      logs.db.warn("MongoDB already connected");
      return;
    }

    try {
      await mongoose.connect(config.db.mongoUri, clientOptions);
      status.connected = true;
      logs.db.info("MongoDB connected");

      if (!status.listenersAttached) {
        mongoose.connection.on("disconnected", () => {
          status.connected = false;
          logs.db.warn("MongoDB disconnected!");
        });

        mongoose.connection.on("reconnected", () => {
          status.connected = true;
          logs.db.info("MongoDB reconnected!");
        });

        mongoose.connection.on("error", (err) => {
          logs.db.error(`MongoDB error: ${err.message}`);
        });

        status.listenersAttached = true;
      }
    } catch (err) {
      logs.db.error(`MongoDB connection failed: ${(err as Error).message}`);
      process.exit(1);
    }
  },

  // Disconnect MongoDB
  disconnect: async (): Promise<void> => {
    if (!status.connected) {
      logs.db.warn("MongoDB already disconnected");
      return;
    }

    try {
      await mongoose.connection.close(false);
      status.connected = false;
      logs.db.info("MongoDB connection closed");
    } catch (err) {
      logs.db.error(`Error closing MongoDB: ${(err as Error).message}`);
    }
  },

  // Graceful shutdown
  shutdown: async (signal: "SIGINT" | "SIGTERM" | string) => {
    logs.db.info(`Received ${signal}. Shutting down gracefully...`);
    await db.disconnect();
    process.exit(0);
  },

  // Status helpers
  isConnected: (): boolean => status.connected,
  getStatus: (): { connected: boolean } => ({ connected: status.connected }),
});
