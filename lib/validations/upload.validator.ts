import { body } from 'express-validator';

const deleteFileRules = [
  body("publicId")
    .trim()
    .notEmpty()
    .withMessage("publicId is required")
    .isString()
    .withMessage("publicId must be a string"),
];

export { deleteFileRules };
