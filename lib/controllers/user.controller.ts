import userService  from '../services/user.service';
import asyncHandler  from '../middleware/asyncHandler';
import ApiResponse  from '../util/ApiResponse';
import HTTP_STATUS  from '../constants/httpStatus';

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, "User fetched successfully", user));
});

export default { 
  getUser,
 };
