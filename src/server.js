const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const createApp = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");

const startServer = async () => {
  await connectDb();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    console.log(`Health check: http://localhost:${env.port}${env.apiPrefix}/health`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
