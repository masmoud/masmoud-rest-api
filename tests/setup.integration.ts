import mongoose from "mongoose";

const skipDbSetup = process.env.SKIP_INTEGRATION_DB === "true";
const runDbIntegration = process.env.RUN_DB_INTEGRATION === "true";
const externalMongoUri = process.env.TEST_MONGO_URI;

beforeAll(async () => {
  if (skipDbSetup) {
    process.env.NODE_ENV = "test";
    return;
  }

  if (!runDbIntegration && !externalMongoUri) {
    process.env.NODE_ENV = "test";
    return;
  }

  if (runDbIntegration && !externalMongoUri) {
    throw new Error("TEST_MONGO_URI is required when RUN_DB_INTEGRATION=true");
  }

  const uri = externalMongoUri as string;

  process.env.MONGO_URI = uri;
  process.env.NODE_ENV = "test";

  await mongoose.connect(uri);
});

afterEach(async () => {
  if (skipDbSetup || mongoose.connection.readyState === 0) {
    return;
  }

  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  if (!skipDbSetup && mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});
