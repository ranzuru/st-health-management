// Routes.js
const express = require("express");
const authController = require("../controllers/authController.js");
const authenticateMiddleware = require("../auth/authenticateMiddleware.js");
const refreshTokenMiddleware = require("./refreshTokenMiddleware");
const router = express.Router();

// Signup route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Protected route
router.get("/protected", authenticateMiddleware, (req, res) => {
  // The authenticateMiddleware ensures only authenticated users can access this route
  res.json({ message: "Access granted to protected route", user: req.user });
});
router.post("/token", refreshTokenMiddleware, authController.refreshToken);

module.exports = router;
