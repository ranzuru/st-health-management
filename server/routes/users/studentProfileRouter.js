const express = require("express");
const StudentProfile = require("../../models/StudentProfileSchema");
const ClassProfile = require("../../models/ClassProfileSchema");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Create a new student profile
router.post("/createStudent", authenticateMiddleware, async (req, res) => {
  try {
    const { grade, section, ...studentData } = req.body;
    const classProfile = await ClassProfile.findOne({ grade, section });
    if (!classProfile)
      return res.status(400).json({ error: "Invalid grade or section" });

    const newStudent = new StudentProfile({
      ...studentData,
      classProfile: classProfile._id, // Using the _id of the found class profile
    });

    await newStudent.save();
    res.status(201).json({ newStudent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all student profiles
router.get("/fetchStudent", authenticateMiddleware, async (req, res) => {
  try {
    const students = await StudentProfile.find({})
      .populate("classProfile")
      .exec();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if an LRN is unique
router.post("/checkLRNUnique", authenticateMiddleware, async (req, res) => {
  try {
    const { lrn } = req.body;
    if (!lrn) {
      return res.status(400).json({ error: "LRN is required" });
    }

    const existingStudent = await StudentProfile.findOne({ lrn });
    if (existingStudent) {
      return res.status(200).json({ isUnique: false });
    } else {
      return res.status(200).json({ isUnique: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a student profile by LRN
router.get("/:lrn", authenticateMiddleware, async (req, res) => {
  try {
    const student = await StudentProfile.findOne({
      lrn: req.params.lrn,
    }).populate("classProfile");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search/:partialLrn", authenticateMiddleware, async (req, res) => {
  try {
    const partialLrn = req.params.partialLrn;
    const students = await StudentProfile.find({
      lrn: new RegExp(partialLrn, "i"),
      status: "Enrolled",
    })
      .populate("classProfile", "grade section academicYear -_id") // Populating grade and section from ClassProfile
      .select(
        "lrn lastName firstName middleName nameExtension gender age birthDate classProfile -_id"
      );

    if (!students || students.length === 0)
      return res.status(404).json({ error: "No matches found" });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a student profile
router.put("/updateStudent/:lrn", authenticateMiddleware, async (req, res) => {
  const { grade, section, ...updateData } = req.body;
  let classProfileId;

  if (grade && section) {
    const classProfile = await ClassProfile.findOne({ grade, section });
    if (!classProfile) {
      return res.status(400).json({ error: "Invalid grade or section" });
    }
    classProfileId = classProfile._id;
  }

  try {
    const updatedFields = {
      ...updateData,
      ...(classProfileId && { classProfile: classProfileId }),
    };
    const student = await StudentProfile.findOneAndUpdate(
      { lrn: req.params.lrn },
      updatedFields,
      { new: true }
    ).populate("classProfile");

    if (!student) return res.status(404).json({ error: "Student not found" });

    res.status(200).json({ student, classProfile: student.classProfile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a student profile
router.delete(
  "/deleteStudent/:lrn",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const student = await StudentProfile.findOneAndDelete({
        lrn: req.params.lrn,
      });
      if (!student) return res.status(404).json({ error: "Student not found" });
      res.status(200).json({ message: "Student deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
