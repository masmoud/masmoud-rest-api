import mongoose from "mongoose";
import { dbLogger } from "./logger";
import { dbConfig } from "./env";

let isConnected = false;
let listenersAttached = false;

const connectDB = async () => {
  if (isConnected) {
    dbLogger.warn("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(dbConfig.mongoUri, {
      autoIndex: true,
      autoCreate: true,
    });
    isConnected = true;
    dbLogger.info(`MongoDB Connected`);

    if (!listenersAttached) {
      // Handle unexpected deconnections
      mongoose.connection.on("disconnected", () => {
        isConnected = false;
        dbLogger.warn("MongoDB disconnected!");
      });

      mongoose.connection.on("reconnected", () => {
        isConnected = true;
        dbLogger.info("MongoDB reconnected!");
      });

      mongoose.connection.on("error", (error) => {
        dbLogger.error(`MongoDB error: ${error.message}`);
      });

      listenersAttached = true;
    }
  } catch (error) {
    dbLogger.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

//  Disconnect MongoDB
const disconnectDB = async (): Promise<void> => {
  if (!isConnected) {
    dbLogger.warn("MongoDB already disconnected");
    return;
  }

  try {
    await mongoose.connection.close(false);
    isConnected = false;
    dbLogger.info("MongoDB connection closed");
  } catch (error) {
    dbLogger.error(`Error while closing MongoDB: ${(error as Error).message}`);
  }
};

// Handle proper shutdown
const gracefulShutdown = async (signal: string) => {
  dbLogger.info(`Received ${signal}. Shutting down gracefully...`);
  await disconnectDB();
  process.exit(0);
};

export { connectDB, disconnectDB, gracefulShutdown };
