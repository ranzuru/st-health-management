const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateMiddleware = require("./authenticateMiddleware");

const sendError = (res, message, status = 500) => {
  return res.status(status).json({ error: message });
};

// Ensure all environment variables are set
if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.error("Environment variables are not set!");
  process.exit(1);
}

// Signup route
router.post("/register", async (req, res) => {
  try {
    await authController.register(req, res);
  } catch (error) {
    sendError(res, "An error occurred");
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    sendError(res, "An error occurred");
  }
});

// Verify OTP route
router.post("/verify-otp", async (req, res) => {
  try {
    await authController.verifyOtp(req, res);
  } catch (error) {
    sendError(res, "An error occurred during OTP verification", 400);
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    await authController.resendOtp(req, res);
  } catch (error) {
    sendError(res, "An error occurred during OTP verification", 400);
  }
});

// Protected route
router.get("/protected", authenticateMiddleware, (req, res) => {
  res
    .status(200)
    .json({ message: "Access granted to protected route", user: req.userData });
});

module.exports = router;
