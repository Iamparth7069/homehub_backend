const { body, param } = require("express-validator");

const createUserRules = [
  body("name").trim().notEmpty().withMessage("name is required").isLength({ min: 2 }).withMessage("name must be at least 2 characters"),
  body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("email must be valid"),
];

const updateUserRules = [
  param("id").isMongoId().withMessage("id must be a valid MongoDB id"),
  body("name").optional().trim().isLength({ min: 2 }).withMessage("name must be at least 2 characters"),
  body("email").optional().trim().isEmail().withMessage("email must be valid"),
];

const userIdRules = [param("id").isMongoId().withMessage("id must be a valid MongoDB id")];

module.exports = {
  createUserRules,
  updateUserRules,
  userIdRules,
};
