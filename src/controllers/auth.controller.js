const authService = require("../services/auth.service");
const uploadService = require("../services/upload.service");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");
const MESSAGES = require("../constants/messages");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.REGISTER_SUCCESS, result));
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, result));
});

const checkEmail = asyncHandler(async (req, res) => {
  const email = req.body.email || req.query.email || "";
  const result = await authService.checkEmail(email);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "Email check completed", result));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "Current user profile fetched", user));
});

const updateAccountSetup = asyncHandler(async (req, res) => {
  const user = await authService.updateAccountSetup(req.user.id, req.body);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "Account setup updated successfully", user));
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.FILE_REQUIRED);
  }

  const uploadResult = await uploadService.uploadImage(req.file, {
    folder: "backend-api/avatars",
  });

  const updatedUser = await authService.updateAccountSetup(req.user.id, {
    imageUrl: uploadResult.url,
    profileImage: uploadResult.url,
  });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.FILE_UPLOAD_SUCCESS, {
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      user: updatedUser,
    })
  );
});

module.exports = {
  register,
  login,
  checkEmail,
  getMe,
  updateAccountSetup,
  uploadAvatar,
};
