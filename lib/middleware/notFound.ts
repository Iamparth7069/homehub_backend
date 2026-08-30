import ApiError  from '../util/ApiError';
import HTTP_STATUS  from '../constants/httpStatus';
import MESSAGES  from '../constants/messages';

const notFound = (req, res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `${MESSAGES.ROUTE_NOT_FOUND}: ${req.originalUrl}`));
};

export default notFound;
