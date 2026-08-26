const { body } = require("express-validator");

const deleteFileRules = [
  body("publicId")
    .trim()
    .notEmpty()
    .withMessage("publicId is required")
    .isString()
    .withMessage("publicId must be a string"),
];

module.exports = {
  deleteFileRules,
};
