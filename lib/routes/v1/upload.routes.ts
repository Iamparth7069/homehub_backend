import express  from 'express';
import uploadController  from '../../controllers/upload.controller';
import { uploadFlexible } from '../../middleware/upload';
import validateRequest  from '../../middleware/validateRequest';
import { deleteFileRules } from '../../validations/upload.validator';

const router = express.Router();

router.post("/", uploadFlexible(), uploadController.uploadFile);
router.post("/image", uploadFlexible(), uploadController.uploadFile);
router.delete("/", deleteFileRules, validateRequest, uploadController.deleteFile);

export default router;
