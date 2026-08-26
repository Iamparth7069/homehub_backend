const uploadService = require("../services/upload.service");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");
const MESSAGES = require("../constants/messages");
const env = require("../config/env");

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.FILE_REQUIRED);
  }

  const folder = req.body.folder || env.cloudinary.folder;
  const data = await uploadService.uploadImage(req.file, { folder });

  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.FILE_UPLOAD_SUCCESS, data));
});

const deleteFile = asyncHandler(async (req, res) => {
  const publicId = req.body.publicId || req.params.publicId;
  const data = await uploadService.deleteImage(publicId);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.FILE_DELETE_SUCCESS, data));
});

module.exports = {
  uploadFile,
  deleteFile,
};
