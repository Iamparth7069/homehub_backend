const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");
const MESSAGES = require("../constants/messages");

const listUsers = async () => User.find().sort({ createdAt: -1 });

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }
  return user;
};

const createUser = async (payload) => {
  const email = (payload.email || "").toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.EMAIL_EXISTS);
  }
  return User.create({
    ...payload,
    email,
    password: payload.password || "123456",
  });
};

const updateUser = async (id, payload) => {
  await getUserById(id);

  if (payload.email) {
    const email = payload.email.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== id) {
      throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.EMAIL_EXISTS);
    }
    payload.email = email;
  }

  const user = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return user;
};

const deleteUser = async (id) => {
  await getUserById(id);
  await User.findByIdAndDelete(id);
};

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
