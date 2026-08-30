import ApiError  from '../util/ApiError';
import HTTP_STATUS  from '../constants/httpStatus';
import MESSAGES  from '../constants/messages';
import env  from '../config/env';

const errorHandler = (err, req, res, next) => {
  const statusCode =
    err instanceof ApiError ? err.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.INTERNAL_ERROR;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
