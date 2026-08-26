const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");
const MESSAGES = require("../constants/messages");

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }
  return user;
};

module.exports = {
  getUserById,
};
