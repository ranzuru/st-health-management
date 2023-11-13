// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOTP);

module.exports = router;
