const express = require("express");
const router = express.Router();
const FacultyCheckup = require("../../models/FacultyCheckupSchema");
const FacultyProfile = require("../../models/FacultyProfileSchema");
const ClassProfile = require("../../models/ClassProfileSchema");
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
router.get("/fetch/:status", authenticateMiddleware, async (req, res) => {
  const { status } = req.params;

  if (!["Active", "Archived", "Inactive"].includes(status)) {
    return res.status(400).json({ error: "Invalid faculty status." });
  }

  try {
    const faculty = await FacultyProfile.find({ status: status });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
      // Search for FacultyProfile using the employeeId
      const facultyProfile = await FacultyProfile.findOne({
        employeeId: req.params.employeeId,
      });

      // If not found, return an error
      if (!facultyProfile) {
        return res.status(404).json({ message: "Faculty profile not found" });
      }

      // Extract the ObjectId from the returned document
      const objectId = facultyProfile._id;

      // Check if faculty is assigned to any ClassProfile
      const classAssigned = await ClassProfile.findOne({ faculty: objectId });

      if (classAssigned) {
        return res.status(400).json({
          message:
            "Please re-assign the teacher in classProfile before deactivating the faculty profile.",
        });
      }

      // Update the status of the faculty profile
      facultyProfile.status = "Inactive";
      await facultyProfile.save();

      await FacultyCheckup.updateMany(
        { facultyProfile: objectId },
        { status: "Inactive" }
      );

      res
        .status(200)
        .json({ message: "Faculty profile and related checkups deactivated" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/archiveFaculty/:employeeId",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const employeeId = req.params.employeeId;

      // Find the faculty profile by employeeId
      const faculty = await FacultyProfile.findOne({ employeeId });

      if (!faculty) {
        return res.status(404).json({ error: "Faculty not found" });
      }

      // Check if the faculty is already archived
      if (faculty.status === "Archived") {
        return res.status(400).json({ error: "Faculty already archived" });
      }

      // Archive the faculty profile
      faculty.status = "Archived";
      await faculty.save();

      res
        .status(200)
        .json({ message: "Faculty archived successfully", faculty });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/reinstateFaculty/:employeeId",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const employeeId = req.params.employeeId;

      // Find the faculty profile by employeeId
      const faculty = await FacultyProfile.findOne({ employeeId });

      if (!faculty) {
        return res.status(404).json({ error: "Faculty not found" });
      }

      // Check if the faculty is already active
      if (faculty.status === "Active") {
        return res.status(400).json({ error: "Faculty is already active" });
      }

      // Reinstate the faculty profile
      faculty.status = "Active";
      await faculty.save();

      res
        .status(200)
        .json({ message: "Faculty reinstated successfully", faculty });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/hardDeleteFaculty/:employeeId",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const employeeId = req.params.employeeId;

      const deleteResult = await FacultyProfile.deleteOne({ employeeId });

      if (deleteResult.deletedCount === 0) {
        return res
          .status(404)
          .json({ error: "Faculty not found or already deleted" });
      }

      res.status(200).json({ message: "Faculty deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
