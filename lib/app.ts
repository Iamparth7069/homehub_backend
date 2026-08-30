import express  from 'express';
import cors  from 'cors';
import helmet  from 'helmet';
import morgan  from 'morgan';
import env  from './config/env';
import v1Routes  from './routes/v1';
import notFound  from './middleware/notFound';
import errorHandler  from './middleware/errorHandler';

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

export default createApp;
