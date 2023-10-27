const express = require("express");
const DengueMonitoring = require("../../models/DengueSchema");
const StudentProfile = require("../../models/StudentProfileSchema");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Create a new dengue monitoring record
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { lrn, ...dengueData } = req.body;
    const student = await StudentProfile.findOne({ lrn });

    if (!student) return res.status(400).json({ error: "Invalid LRN" });

    const newDengueRecord = new DengueMonitoring({
      ...dengueData,
      studentProfile: student._id,
    });

    await newDengueRecord.save();

    const populatedDengueRecord = await DengueMonitoring.findById(
      newDengueRecord._id
    )
      .populate({
        path: "studentProfile",
        populate: {
          path: "classProfile",
        },
      })
      .exec();

    res.status(201).json({ newDengueRecord: populatedDengueRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch all dengue monitoring records
router.get("/fetch", authenticateMiddleware, async (req, res) => {
  try {
    const records = await DengueMonitoring.find()
      .populate({
        path: "studentProfile",
        populate: { path: "classProfile" },
      })
      .exec();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a dengue monitoring record by LRN
router.put("/update/:lrn", authenticateMiddleware, async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({
      lrn: req.params.lrn,
    });
    if (!studentProfile)
      return res.status(404).json({ error: "StudentProfile not found" });

    const existingRecord = await DengueMonitoring.findOne({
      studentProfile: studentProfile._id,
    });
    if (!existingRecord)
      return res
        .status(404)
        .json({ error: "Dengue monitoring record not found" });

    const updatedData = { ...existingRecord.toObject(), ...req.body };

    const updatedDengueRecord = await DengueMonitoring.findOneAndUpdate(
      { studentProfile: studentProfile._id },
      updatedData,
      { new: true }
    ).populate({
      path: "studentProfile",
      populate: { path: "classProfile" },
    });

    res.status(200).json(updatedDengueRecord);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
        "lrn lastName firstName middleName nameExtension gender age birthDate address classProfile -_id"
      );

    if (!students || students.length === 0)
      return res.status(404).json({ error: "No matches found" });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a dengue monitoring record by ID
router.delete("/delete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const record = await DengueMonitoring.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
