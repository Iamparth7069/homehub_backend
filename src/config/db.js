const dns = require('node:dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch(e) {}

const mongoose = require("mongoose");
const env = require("./env");

const connectDb = async () => {
  if (!env.mongoUri) {
    throw new Error(
      "MONGODB_URI is missing. Add it to .env (from MongoDB Atlas → Connect → Drivers)."
    );
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri);

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
  return mongoose.connection;
};

module.exports = { connectDb };
