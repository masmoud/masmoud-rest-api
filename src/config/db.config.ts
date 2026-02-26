import mongoose, { ConnectOptions } from "mongoose";
import { config } from "./env.config";
import { logs } from "@/common/utils";

class Database {
  private connected = false;
  private listenersAttached = false;

  private readonly clientOptions: ConnectOptions = {
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

  //  Connect to MongoDB
  async connect(): Promise<void> {
    if (this.connected) {
      logs.db.warn("MongoDB already connected");
      return;
    }

    try {
      await mongoose.connect(config.db.mongoUri, this.clientOptions);

      this.connected = true;
      logs.db.info("MongoDB connected");

      this.attachEventListeners();
    } catch (err) {
      logs.db.error(`MongoDB connection failed: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  // Disconnect from MongoDB
  async disconnect(): Promise<void> {
    if (!this.connected) {
      logs.db.warn("MongoDB already disconnected");
      return;
    }

    try {
      await mongoose.connection.close(false);
      this.connected = false;
      logs.db.info("MongoDB connection closed");
    } catch (err) {
      logs.db.error(`Error closing MongoDB: ${(err as Error).message}`);
    }
  }

  // Graceful shutdown handler
  async shutdown(signal: "SIGINT" | "SIGTERM" | string): Promise<void> {
    logs.db.info(`Received ${signal}. Shutting down gracefully...`);
    await this.disconnect();
    process.exit(0);
  }

  // Return connection status
  isConnected(): boolean {
    return this.connected;
  }

  getStatus(): { connected: boolean } {
    return { connected: this.connected };
  }

  // Attach mongoose event listeners once
  private attachEventListeners(): void {
    if (this.listenersAttached) return;

    mongoose.connection.on("disconnected", () => {
      this.connected = false;
      logs.db.warn("MongoDB disconnected!");
    });

    mongoose.connection.on("reconnected", () => {
      this.connected = true;
      logs.db.info("MongoDB reconnected!");
    });

    mongoose.connection.on("error", (err) => {
      logs.db.error(`MongoDB error: ${err.message}`);
    });

    this.listenersAttached = true;
  }
}

export const db = new Database();
