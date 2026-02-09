import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

let isConnected = false;
let listenersAttached = false;

const connectDB = async () => {
  if (isConnected) {
    logger.warn("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
      autoCreate: true,
    });
    isConnected = true;
    logger.info(`MongoDB Connected`);

    if (!listenersAttached) {
      // Handle unexpected deconnections
      mongoose.connection.on("disconnected", () => {
        isConnected = false;
        logger.warn("MongoDB disconnected!");
      });

      mongoose.connection.on("reconnected", () => {
        isConnected = true;
        logger.info("MongoDB reconnected!");
      });

      mongoose.connection.on("error", (error) => {
        logger.error(`MongoDB error: ${error.message}`);
      });

      listenersAttached = true;
    }
  } catch (error) {
    logger.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

//  Disconnect MongoDB
const disconnectDB = async (): Promise<void> => {
  if (!isConnected) {
    logger.warn("MongoDB already disconnected");
    return;
  }

  try {
    await mongoose.connection.close(false);
    isConnected = false;
    logger.info("MongoDB connection closed");
  } catch (error) {
    logger.error(`Error while closing MongoDB: ${(error as Error).message}`);
  }
};

// Handle proper shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  await disconnectDB();
  process.exit(0);
};

export { connectDB, disconnectDB, gracefulShutdown };
