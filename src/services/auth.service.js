const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");
const MESSAGES = require("../constants/messages");
const env = require("../config/env");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role || "user",
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
};

const register = async ({
  email,
  password,
  fullName,
  name,
  nickname,
  dob,
  imageUrl,
  profileImage,
  firstName,
  lastName,
  phoneNumber,
  address,
  fcmToken,
  accountSetup = false,
  role,
}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.EMAIL_EXISTS);
  }

  const finalFullName = fullName || name || ((firstName || "") + " " + (lastName || "")).trim() || normalizedEmail.split("@")[0];
  const finalImage = imageUrl || profileImage || "";

  const user = await User.create({
    email: normalizedEmail,
    password,
    fullName: finalFullName,
    name: finalFullName,
    nickname: nickname || "",
    dob: dob || "",
    imageUrl: finalImage,
    profileImage: finalImage,
    firstName: firstName || "",
    lastName: lastName || "",
    phoneNumber: phoneNumber || "",
    address: address || "",
    fcmToken: fcmToken || "",
    accountSetup: Boolean(accountSetup),
    role: role || "user",
  });

  const token = generateToken(user);
  return { user, token };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
  }

  const token = generateToken(user);
  const userResponse = user.toJSON();

  return { user: userResponse, token };
};

const updateAccountSetup = async (userId, payload) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }

  const updateData = { ...payload };

  // Handle name fields
  if (updateData.fullName) {
    updateData.name = updateData.fullName;
  } else if (updateData.name) {
    updateData.fullName = updateData.name;
  } else if (updateData.firstName || updateData.lastName) {
    const calculatedName = ((updateData.firstName || user.firstName || "") + " " + (updateData.lastName || user.lastName || "")).trim();
    updateData.fullName = calculatedName;
    updateData.name = calculatedName;
  }

  // Handle image fields
  if (updateData.imageUrl) {
    updateData.profileImage = updateData.imageUrl;
  } else if (updateData.profileImage) {
    updateData.imageUrl = updateData.profileImage;
  }

  // Set accountSetup flag to true
  updateData.accountSetup = true;

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

module.exports = {
  generateToken,
  register,
  login,
  updateAccountSetup,
};
