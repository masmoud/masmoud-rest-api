const { spawnSync } = require("node:child_process");

const baseEnv = { ...process.env };

const run = (label, command, args, env = baseEnv) => {
  console.log(`\n==> ${label}`);

  const result = spawnSync(command, args, {
    stdio: "inherit",
    env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run("Unit tests", "npm", ["run", "test:unit"]);
run("Integration tests (no DB)", "npm", ["run", "test:integration"]);

if (process.env.TEST_MONGO_URI) {
  run(
    "Integration tests (DB)",
    "npx",
    [
      "cross-env",
      "RUN_DB_INTEGRATION=true",
      `TEST_MONGO_URI=${process.env.TEST_MONGO_URI}`,
      "jest",
      "--selectProjects",
      "integration",
      "--runTestsByPath",
      "tests/auth.register.integration.spec.ts",
      "--verbose",
    ],
    {
      ...baseEnv,
      TEST_MONGO_URI: process.env.TEST_MONGO_URI,
    },
  );
} else {
  console.log("\n==> Integration tests (DB)");
  console.log(
    "Skipping DB-backed integration tests because TEST_MONGO_URI is not set.",
  );
}
