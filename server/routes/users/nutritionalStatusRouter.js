const express = require("express");
const NutritionalStatus = require("../../models/NutritionalStatusSchema");
const StudentProfile = require("../../models/StudentProfileSchema");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Create
router.post("/create", authenticateMiddleware, async (req, res) => {
  console.log("Data:", req.body);
  try {
    const { lrn, measurementType, ...nutritionalData } = req.body;

    const student = await StudentProfile.findOne({ lrn });
    if (!student) return res.status(400).json({ error: "Invalid LRN" });

    const existingRecord = await NutritionalStatus.findOne({
      studentProfile: student._id,
      measurementType: measurementType,
    });

    if (existingRecord) {
      return res.status(400).json({
        error: "A record for this student and measurement type already exists.",
      });
    }
    console.log(nutritionalData);
    const newRecord = new NutritionalStatus({
      ...nutritionalData,
      lrn: lrn,
      studentProfile: student._id,
      measurementType: measurementType,
    });

    await newRecord.save();
    const populatedRecord = await NutritionalStatus.findById(newRecord._id)
      .populate({
        path: "studentProfile",
        populate: {
          path: "classProfile",
        },
      })
      .exec();

    res.status(201).json({ newNutritionalStatus: populatedRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read
router.get("/fetch/:type", authenticateMiddleware, async (req, res) => {
  const { type } = req.params;

  if (!["PRE", "POST"].includes(type.toUpperCase())) {
    return res.status(400).json({ error: "Invalid measurement type." });
  }

  try {
    const records = await NutritionalStatus.find({
      measurementType: type.charAt(0).toUpperCase() + type.slice(1),
    }).populate({
      path: "studentProfile",
      populate: { path: "classProfile" },
    });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put("/update/:id", authenticateMiddleware, async (req, res) => {
  try {
    const updatedRecord = await NutritionalStatus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("studentProfile");

    if (!updatedRecord)
      return res.status(404).json({ error: "Record not found" });

    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete
router.delete("/delete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const deletedRecord = await NutritionalStatus.findByIdAndDelete(
      req.params.id
    );

    if (!deletedRecord)
      return res.status(404).json({ error: "Record not found" });

    res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
