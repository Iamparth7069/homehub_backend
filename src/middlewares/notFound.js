const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");
const MESSAGES = require("../constants/messages");

const notFound = (req, res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `${MESSAGES.ROUTE_NOT_FOUND}: ${req.originalUrl}`));
};

module.exports = notFound;
