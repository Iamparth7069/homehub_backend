const { Readable } = require("stream");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");
const MESSAGES = require("../constants/messages");

const ensureConfigured = () => {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.CLOUDINARY_NOT_CONFIGURED);
  }
};

const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const uploadImage = (file, options = {}) => {
  ensureConfigured();

  if (!file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.FILE_REQUIRED);
  }

  const folder = options.folder || env.cloudinary.folder;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        ...(options.publicId && { public_id: options.publicId }),
      },
      (error, result) => {
        if (error) {
          return reject(
            new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || MESSAGES.INTERNAL_ERROR)
          );
        }

        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          folder: result.folder || folder,
          resourceType: result.resource_type,
          createdAt: result.created_at,
        });
      }
    );

    bufferToStream(file.buffer).pipe(uploadStream);
  });
};

const deleteImage = async (publicId) => {
  ensureConfigured();

  if (!publicId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "publicId is required");
  }

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FILE_DELETE_FAILED);
  }

  return {
    publicId,
    result: result.result,
  };
};

module.exports = {
  uploadImage,
  deleteImage,
};
