const { body } = require("express-validator");

const registerRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("fullName")
    .optional()
    .trim(),
  body("name")
    .optional()
    .trim(),
  body("nickname")
    .optional()
    .trim(),
  body("dob")
    .optional()
    .trim(),
  body("imageUrl")
    .optional()
    .trim(),
  body("profileImage")
    .optional()
    .trim(),
  body("phoneNumber")
    .optional()
    .trim(),
  body("address")
    .optional()
    .trim(),
  body("accountSetup")
    .optional()
    .isBoolean()
    .withMessage("accountSetup must be a boolean (true/false)"),
];

const loginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const accountSetupRules = [
  body("fullName")
    .optional()
    .trim(),
  body("name")
    .optional()
    .trim(),
  body("imageUrl")
    .optional()
    .trim(),
  body("profileImage")
    .optional()
    .trim(),
  body("nickname")
    .optional()
    .trim(),
  body("dob")
    .optional()
    .trim(),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("phoneNumber")
    .optional()
    .trim(),
  body("address")
    .optional()
    .trim(),
  body("accountSetup")
    .optional()
    .isBoolean(),
];

module.exports = {
  registerRules,
  loginRules,
  accountSetupRules,
};
