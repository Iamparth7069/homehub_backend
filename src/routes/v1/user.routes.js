const express = require("express");
const userController = require("../../controllers/user.controller");
const { authenticate } = require("../../middlewares/auth");

const router = express.Router();

router.get("/", authenticate, userController.getUser);

module.exports = router;
