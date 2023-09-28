const express = require("express");
const router = express.Router();
const ClassSchema = require("../../models/ClassProfileSchema"); // Adjust the path as needed
const FacultySchema = require("../../models/FacultyProfileSchema"); // Adjust the path as needed
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Create a new ClassProfile with a reference to a FacultyProfile using employeeId
router.post("/createClassProfile", authenticateMiddleware, async (req, res) => {
  try {
    const { grade, section, room, syFrom, syTo, faculty } = req.body;

    // Check if the provided employeeId is valid
    const facultyProfile = await FacultySchema.findOne({
      employeeId: faculty,
    });
    if (!facultyProfile) {
      return res.status(404).json({ error: "FacultyProfile not found" });
    }

    // Validate that none of the fields are missing
    if (!grade || !section || !room || !syFrom || !syTo || !faculty) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const classProfile = new ClassSchema({
      grade,
      section,
      room,
      syFrom,
      syTo,
      faculty: facultyProfile._id,
    });

    await classProfile.save();
    const populatedClassProfile = await ClassSchema.findById(
      classProfile._id
    ).populate("faculty");
    res.status(201).json({ classProfile: populatedClassProfile });
  } catch (error) {
    console.error("An error occurred:", error.message); // Debug: Log error
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({
        error: "This grade-section combination already exists in the database",
      });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get all ClassProfiles with faculty name populated
router.get("/fetchClassProfile", authenticateMiddleware, async (req, res) => {
  try {
    const classProfiles = await ClassSchema.find().populate({
      path: "faculty",
      match: { role: "Adviser" },
      select: "employeeId firstName lastName",
      transform: (doc) => ({
        _id: doc.employeeId,
        name: `${doc.firstName} ${doc.lastName}`,
      }),
    });
    res.json(classProfiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get a single ClassProfile by ID with faculty name populated
router.get(
  "/fetchClassProfile/:id",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const classProfile = await ClassSchema.findById(req.params.id).populate({
        path: "faculty",
        select: "firstName lastName",
        transform: (doc) => ({
          _id: doc.employeeId,
          name: `${doc.firstName} ${doc.lastName}`,
        }),
      });

      if (!classProfile) {
        return res.status(404).json({ error: "ClassProfile not found" });
      }

      res.json(classProfile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

// Update a ClassProfile by ID
router.put(
  "/updateClassProfile/:id",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const { grade, section, room, syFrom, syTo, faculty } = req.body; // change employeeId to faculty
      const facultyProfile = await FacultySchema.findOne({
        employeeId: faculty,
      }); // change employeeId to faculty

      if (!facultyProfile) {
        return res.status(404).json({ error: "FacultyProfile not found" });
      }

      const classProfile = await ClassSchema.findByIdAndUpdate(
        req.params.id,
        {
          grade,
          section,
          room,
          syFrom,
          syTo,
          faculty: facultyProfile._id,
        },
        { new: true }
      ).populate("faculty");

      if (!classProfile) {
        return res.status(404).json({ error: "ClassProfile not found" });
      }

      res.json({ classProfile });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete a ClassProfile by ID
router.delete(
  "/deleteClassProfile/:id",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const classProfile = await ClassSchema.findByIdAndRemove(req.params.id);

      if (!classProfile) {
        return res.status(404).json({ error: "ClassProfile not found" });
      }

      res.json({ message: "ClassProfile deleted" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

module.exports = router;
