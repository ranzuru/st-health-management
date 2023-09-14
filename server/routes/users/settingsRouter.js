const express = require("express");
const User = require("../../models/User.js");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js"); // Import your middleware
const router = express.Router();

// Protected route to fetch user settings
router.get("/user/fetchSettings", authenticateMiddleware, async (req, res) => {
  try {
    // Fetch the authenticated user's settings data based on their ID
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract and send the user's settings data in the response
    const userSettings = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      // Add other settings fields here as needed
    };

    res.status(200).json({ userSettings });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
