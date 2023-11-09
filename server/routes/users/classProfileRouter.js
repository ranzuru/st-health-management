const express = require("express");
const router = express.Router();
const ClassProfile = require("../../models/ClassProfileSchema"); // Adjust the path as needed
const FacultyProfile = require("../../models/FacultyProfileSchema"); // Adjust the path as needed
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const { createLog } = require("../recordLogRouter.js");

// Create a new ClassProfile with a reference to a FacultyProfile using employeeId
router.post("/createClassProfile", authenticateMiddleware, async (req, res) => {
  try {
    const { grade, section, room, faculty } = req.body;

    // Check if the provided employeeId is valid
    const facultyProfile = await FacultyProfile.findOne({
      employeeId: faculty,
    });
    if (!facultyProfile) {
      return res.status(404).json({ error: "FacultyProfile not found" });
    }

    // Validate that none of the fields are missing
    if (!grade || !section || !room || !faculty) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate that the grade-section combination is unique
    const existingClassProfile = await ClassProfile.findOne({ grade, section });
    if (existingClassProfile) {
      return res
        .status(400)
        .json({ error: "This grade-section combination already exists" });
    }

    const classProfile = new ClassProfile({
      grade,
      section,
      room,
      faculty: facultyProfile._id,
    });

    await classProfile.save();
    await createLog('Class Profile', 'CREATE', `${classProfile}`, req.userData.userId);
    const populatedClassProfile = await ClassProfile.findById(
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
    const classProfiles = await ClassProfile.find().populate({
      path: "faculty",
      // match: { role: "Adviser" },
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
      const classProfile = await ClassProfile.findById(req.params.id).populate({
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

router.post(
  "/checkGradeSectionUnique",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const { grade, section } = req.body;

      // Check if the grade and section combination is unique
      const existingRecord = await ClassProfile.findOne({
        $and: [{ grade }, { section }],
      });

      return res.status(200).json({ isUnique: !existingRecord });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update a ClassProfile by ID
router.put(
  "/updateClassProfile/:id",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const { grade, section, room, faculty } = req.body;
      const facultyProfile = await FacultyProfile.findOne({
        employeeId: faculty,
      });

      if (!facultyProfile) {
        return res.status(404).json({ error: "FacultyProfile not found" });
      }

      const classProfile = await ClassProfile.findByIdAndUpdate(
        req.params.id,
        {
          grade,
          section,
          room,
          faculty: facultyProfile._id,
        },
        { new: true }
      ).populate("faculty");

      if (!classProfile) {
        return res.status(404).json({ error: "ClassProfile not found" });
      }

      res.json({ classProfile });
      await createLog('Class Profile', 'UPDATE', `${classProfile}`, req.userData.userId);
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
      const classProfile = await ClassProfile.findByIdAndRemove(req.params.id);

      if (!classProfile) {
        return res.status(404).json({ error: "ClassProfile not found" });
      }

      res.json({ message: "ClassProfile deleted" });
      await createLog('Class Profile', 'DELETE', `${classProfile}`, req.userData.userId);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

module.exports = router;
