import cors, { CorsOptions } from "cors";
import { corsConfig } from "@/config/env";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (corsConfig.allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("CORS Error: Not allowed by origin"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export const corsMiddleware = cors(corsOptions);
