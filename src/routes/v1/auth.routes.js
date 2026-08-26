const express = require("express");
const authController = require("../../controllers/auth.controller");
const {
  registerRules,
  loginRules,
  checkEmailRules,
  accountSetupRules,
} = require("../../validators/auth.validator");
const validateRequest = require("../../middlewares/validateRequest");
const { authenticate } = require("../../middlewares/auth");
const { uploadFlexible } = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", registerRules, validateRequest, authController.register);
router.post("/login", loginRules, validateRequest, authController.login);
router.post("/check-email", checkEmailRules, validateRequest, authController.checkEmail);
router.get("/check-email", checkEmailRules, validateRequest, authController.checkEmail);
router.get("/me", authenticate, authController.getMe);
router.patch("/account-setup", authenticate, accountSetupRules, validateRequest, authController.updateAccountSetup);
router.post("/account-setup", authenticate, accountSetupRules, validateRequest, authController.updateAccountSetup);
router.post("/upload-avatar", authenticate, uploadFlexible(), authController.uploadAvatar);

module.exports = router;
