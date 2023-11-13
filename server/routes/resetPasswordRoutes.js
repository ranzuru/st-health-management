const express = require("express");
const router = express.Router();
const {
  resetPassword,
  sendPasswordResetEmail,
} = require("../controllers/resetPassword");
const rateLimit = require("express-rate-limit");

const passwordResetLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes window
  max: 2, // start blocking after 3 requests
  message:
    "Too many password reset requests from this IP, please try again after a minute",
});

// POST route to request a password reset email
router.post("/request-reset-email", passwordResetLimiter, async (req, res) => {
  // Call your sendPasswordResetEmail function here
  try {
    await sendPasswordResetEmail(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Error sending password reset email",
      error: error.message,
    });
  }
});
// POST route to reset the password
router.post("/reset", async (req, res) => {
  try {
    await resetPassword(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
});

module.exports = router;
