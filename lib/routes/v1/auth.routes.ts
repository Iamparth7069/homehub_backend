import express  from 'express';
import authController  from '../../controllers/auth.controller';
import authValidator from "../../validations/auth.validator";
const {
  registerRules,
  loginRules,
  accountSetupRules,
} = authValidator;
import validateRequest  from '../../middleware/validateRequest';
import { authenticate } from '../../middleware/auth';
import { uploadFlexible } from '../../middleware/upload';

const router = express.Router();

router.post("/register", registerRules, validateRequest, authController.register);
router.post("/login", loginRules, validateRequest, authController.login);
router.patch("/account-setup", authenticate, accountSetupRules, validateRequest, authController.updateAccountSetup);
router.post("/account-setup", authenticate, accountSetupRules, validateRequest, authController.updateAccountSetup);
router.post("/upload-avatar", authenticate, uploadFlexible(), authController.uploadAvatar);

export default router;
