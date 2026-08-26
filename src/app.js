const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const v1Routes = require("./routes/v1");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Backend API",
      docs: `${env.apiPrefix}/auth/login`,
    });
  });

  app.use(env.apiPrefix, v1Routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
