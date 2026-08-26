const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const { uploadFlexible } = require("../../middlewares/upload");
const validateRequest = require("../../middlewares/validateRequest");
const { deleteFileRules } = require("../../validators/upload.validator");

const router = express.Router();

router.post("/", uploadFlexible(), uploadController.uploadFile);
router.post("/image", uploadFlexible(), uploadController.uploadFile);
router.delete("/", deleteFileRules, validateRequest, uploadController.deleteFile);

module.exports = router;
