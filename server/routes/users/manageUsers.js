const express = require("express");
const router = express.Router();
const User = require("../../models/User.js"); // Import your User model
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const roleMiddleware = require("../../auth/roleMiddleware.js");

// Route to fetch user data from MongoDB
router.get(
  "/userFetch/:status",
  authenticateMiddleware,
  roleMiddleware("Admin"),
  async (req, res) => {
    const { status } = req.params;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid user status." });
    }

    try {
      const users = await User.find({ status: status, approved: true }).exec();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/approvalFetch",
  authenticateMiddleware,
  roleMiddleware("Admin"),
  async (req, res) => {
    try {
      const users = await User.find({ approved: false }).exec();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Route to update the 'approved' status of a user
router.put(
  "/approveUser/:id",
  authenticateMiddleware,
  roleMiddleware("Admin"),
  async (req, res) => {
    const userId = req.params.id;

    try {
      // Find the user by ID and update the 'approved' field
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { approved: true },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Send the updated user as a JSON response
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error approving user:", error);
      res
        .status(500)
        .json({ error: "An error occurred", details: error.message });
    }
  }
);

router.put("/softDelete/:_id", authenticateMiddleware, async (req, res) => {
  try {
    const userId = req.params._id;
    const user = await User.findOneAndUpdate(
      { _id: userId, status: { $ne: "Inactive" } }, // Ensures we don't update already inactive users
      { status: "Inactive" },
      { new: true } // Returns the updated document
    );

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found or already inactive" });
    }

    // No need to save since findOneAndUpdate saves the document if found and updated
    res.status(200).json({ message: "User marked as Inactive", _id: userId });
  } catch (error) {
    console.error("Error soft deleting user:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/reinstateUser/:_id", authenticateMiddleware, async (req, res) => {
  try {
    const userId = req.params._id;
    const user = await User.findOneAndUpdate(
      { _id: userId, status: "Inactive" }, // Ensures we only update inactive users
      { status: "Active" },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found or already active" });
    }

    res.status(200).json({ message: "User reinstated to Active", _id: userId });
  } catch (error) {
    console.error("Error reinstating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a user by ID
router.delete(
  "/hardDeleteUser/:_id",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const userId = req.params._id;
      const user = await User.findOneAndDelete({ _id: userId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res
        .status(200)
        .json({ message: "User deleted permanently", _id: userId });
    } catch (error) {
      console.error("Error hard deleting user:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments({
      approved: true,
      status: "Active",
    });
    res.json({ count });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/updateUser/:_id", authenticateMiddleware, async (req, res) => {
  const userId = req.params._id;
  const updateData = req.body;

  try {
    const user = await User.findOneAndUpdate({ _id: userId }, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// ...

module.exports = router;
