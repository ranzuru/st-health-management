// Routes.js
const express = require("express");
const authController = require("../controllers/authController.js");
const authenticateMiddleware = require("../auth/authenticateMiddleware.js");
const refreshTokenMiddleware = require("./refreshTokenMiddleware");
const router = express.Router();
const roleMiddleware = require("../auth/roleMiddleware.js");

// Signup route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

router.post("/verify-otp", authController.verifyOtp);

router.post("/resend-otp", authController.resendOtp);

router.post(
  "/internalRegister",
  authenticateMiddleware,
  roleMiddleware("Administrator"),
  authController.internalRegister
);

router.post(
  "/refresh-token",
  refreshTokenMiddleware,
  authController.refreshToken
);

// Protected route
router.get("/protected", authenticateMiddleware, (req, res) => {
  // The authenticateMiddleware ensures only authenticated users can access this route
  res.json({ message: "Access granted to protected route", user: req.user });
});
module.exports = router;
