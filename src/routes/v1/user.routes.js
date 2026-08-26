const express = require("express");
const userController = require("../../controllers/user.controller");
const { createUserRules, updateUserRules, userIdRules } = require("../../validators/user.validator");
const validateRequest = require("../../middlewares/validateRequest");

const router = express.Router();

router.get("/", userController.listUsers);
router.get("/:id", userIdRules, validateRequest, userController.getUser);
router.post("/", createUserRules, validateRequest, userController.createUser);
router.patch("/:id", updateUserRules, validateRequest, userController.updateUser);
router.delete("/:id", userIdRules, validateRequest, userController.deleteUser);

module.exports = router;
