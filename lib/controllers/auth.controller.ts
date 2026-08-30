import authService  from '../services/auth.service';
import uploadService  from '../services/upload.service';
import asyncHandler  from '../middleware/asyncHandler';
import ApiResponse  from '../util/ApiResponse';
import ApiError  from '../util/ApiError';
import HTTP_STATUS  from '../constants/httpStatus';
import MESSAGES  from '../constants/messages';

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

  const uploadResult: any = await uploadService.uploadImage(req.file, {
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

export default { 
  register,
  login,
  updateAccountSetup,
  uploadAvatar,
 };
