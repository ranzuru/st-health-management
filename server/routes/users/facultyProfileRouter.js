const express = require("express");
const router = express.Router();
const FacultyProfile = require("../../models/FacultyProfileSchema");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Create a new faculty profile
router.post(
  "/createFacultyProfiles",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const { email } = req.body;

      // Check if the email is unique
      const existingProfile = await FacultyProfile.findOne({ email });
      if (existingProfile) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const facultyProfile = new FacultyProfile(req.body);
      const savedProfile = await facultyProfile.save();
      res.status(201).json({ faculty: savedProfile });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Check if an employeeId already exists
router.post(
  "/checkEmployeeIdUnique",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const { employeeId } = req.body;

      // Check if the employeeId is unique
      const existingProfile = await FacultyProfile.findOne({ employeeId });
      if (existingProfile) {
        return res.status(200).json({ isUnique: false });
      }

      // If the employeeId is unique
      return res.status(200).json({ isUnique: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get a list of all faculty profiles
router.get(
  "/fetchFacultyProfiles",
  authenticateMiddleware,
  async (req, res) => {
    try {
      let facultyProfiles = await FacultyProfile.find();

      // Combine first name and last name
      facultyProfiles = facultyProfiles.map((profile) => {
        return {
          ...profile._doc,
          name: `${profile.firstName} ${profile.lastName}`,
        };
      });

      res.status(200).json(facultyProfiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get a single faculty profile by employeeId
router.get(
  "/facultyProfiles/:employeeId",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const facultyProfile = await FacultyProfile.findOne({
        employeeId: req.params.employeeId,
      });
      if (!facultyProfile) {
        return res.status(404).json({ message: "Faculty profile not found" });
      }
      res.status(200).json(facultyProfile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update a faculty profile by employeeId
router.put(
  "/updateFacultyProfiles/:employeeId",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const facultyProfile = await FacultyProfile.findOneAndUpdate(
        { employeeId: req.params.employeeId },
        req.body,
        { new: true }
      );
      if (!facultyProfile) {
        return res.status(404).json({ message: "Faculty profile not found" });
      }
      res.status(200).json({ faculty: facultyProfile });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete a faculty profile by employeeId
router.put(
  "/deleteFacultyProfiles/:employeeId",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const updatedProfile = await FacultyProfile.findOneAndUpdate(
        { employeeId: req.params.employeeId },
        { status: "Inactive" },
        { new: true }
      );

      if (!updatedProfile) {
        return res.status(404).json({ message: "Faculty profile not found" });
      }

      res.status(200).json({ message: "Faculty profile deactivated" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
