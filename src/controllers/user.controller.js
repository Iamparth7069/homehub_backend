const userService = require("../services/user.service");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const HTTP_STATUS = require("../constants/httpStatus");

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, "User fetched successfully", user));
});

module.exports = {
  getUser,
};
