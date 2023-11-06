const express = require("express");
const User = require("../../models/User.js");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js"); // Import your middleware
const router = express.Router();
const bcrypt = require("bcrypt");
const { createLog } = require("../recordLogRouter.js");

// Protected route to fetch user settings
router.get("/user/fetchSettings", authenticateMiddleware, async (req, res) => {
  try {
    // Fetch the authenticated user's settings data based on their ID
    const userId = req.user._id;
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
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

// Route to update user's first name
router.put(
  "/user/updateFirstName",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;

      const { firstName } = req.body;

      // Update the user's first name in the database
      await User.findByIdAndUpdate(userId, { firstName });

      res.status(200).json({ message: "First name updated successfully" });
      await createLog('Settings', 'UPDATE', `${userId}`, req.userData.userId);
    } catch (error) {
      console.error("Error updating first name:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  }
);

// Route to update user's last name
router.put("/user/updateLastName", authenticateMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { lastName } = req.body;

    // Update the user's last name in the database
    await User.findByIdAndUpdate(userId, { lastName });

    res.status(200).json({ message: "Last name updated successfully" });
    await createLog('Settings', 'UPDATE', `${lastName}`, req.userData.userId);
  } catch (error) {
    console.error("Error updating last name:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route to update user's password
router.put("/user/updatePassword", authenticateMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Fetch the user from the database
    const user = await User.findById(userId);

    // DEBUGGING LINE: Check if the user exists
    if (!user) {
      console.log("User not found"); // Debugging line
      return res.status(404).json({ error: "User not found" });
    }

    // DEBUGGING LINE: Handle Missing Values for bcrypt.compare
    if (!oldPassword || !user.password) {
      console.log("data and hash arguments required"); // Debugging line
      return res
        .status(400)
        .json({ error: "data and hash arguments required" });
    }

    // Verify the old password provided by the user
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }

    // Check if the new password meets the minimum length requirement
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long" });
    }

    // Generate a salt and hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the database with the hashed password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
    await createLog('Settings', 'UPDATE', `${hashedPassword}`, req.userData.userId);
  } catch (error) {
    // DEBUGGING LINE: Log any errors
    console.error("Error updating password:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
