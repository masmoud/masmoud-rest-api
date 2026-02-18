import compression from "compression";

export const compressionConfig = compression({ threshold: 1024 });
