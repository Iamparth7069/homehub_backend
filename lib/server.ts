import dns  from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import createApp  from './app';
import env  from './config/env';
import { connectDb } from './config/db';

const startServer = async () => {
  await connectDb();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    console.log(`API base: http://localhost:${env.port}${env.apiPrefix}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
