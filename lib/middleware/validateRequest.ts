import { validationResult } from 'express-validator';
import ApiError  from '../util/ApiError';
import HTTP_STATUS  from '../constants/httpStatus';
import MESSAGES  from '../constants/messages';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((error: any) => ({
      field: error.path,
      message: error.msg,
    }));

    throw new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, MESSAGES.VALIDATION_FAILED, formatted);
  }

  next();
};

export default validateRequest;
