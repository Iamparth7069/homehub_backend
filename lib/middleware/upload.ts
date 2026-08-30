import multer  from 'multer';
import ApiError  from '../util/ApiError';
import HTTP_STATUS  from '../constants/httpStatus';
import MESSAGES  from '../constants/messages';

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.INVALID_FILE_TYPE), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// Accepts multiple common field names (file, image, profileImage, avatar)
const uploadFlexible = () => (req, res, next) => {
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.FILE_TOO_LARGE));
      }
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, err.message));
    }

    if (err) {
      return next(err);
    }

    // Populate req.file from whichever field was provided
    if (req.files) {
      const file =
        (req.files.file && req.files.file[0]) ||
        (req.files.image && req.files.image[0]) ||
        (req.files.profileImage && req.files.profileImage[0]) ||
        (req.files.avatar && req.files.avatar[0]);
      if (file) {
        req.file = file;
      }
    }

    next();
  });
};

const uploadSingle = (fieldName = "file") => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.FILE_TOO_LARGE));
      }
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, err.message));
    }

    if (err) {
      return next(err);
    }

    next();
  });
};

export { 
  uploadFlexible,
  uploadSingle,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
 };
