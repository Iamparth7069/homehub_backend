const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const HTTP_STATUS = require("../constants/httpStatus");
const MESSAGES = require("../constants/messages");
const env = require("../config/env");

const getHealth = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.HEALTH_OK, {
      uptime: process.uptime(),
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    })
  );
});

module.exports = { getHealth };
