const express = require("express");
const MedicalCheckup = require("../../models/MedicalCheckupSchema");
const StudentProfile = require("../../models/StudentProfileSchema");
const NutritionalStatus = require("../../models/NutritionalStatusSchema");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Create a new medical checkup
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { lrn, ...medicalData } = req.body;
    // Find the student based on LRN
    const student = await StudentProfile.findOne({ lrn });

    if (!student) return res.status(400).json({ error: "Invalid LRN" });

    // Find the latest nutritional status for the student
    const latestNutrition = await NutritionalStatus.findOne({
      studentProfile: student._id,
    }).sort({ updatedAt: -1 });

    const newCheckup = new MedicalCheckup({
      ...medicalData,
      studentProfile: student._id,
      nutritionalStatus: latestNutrition ? latestNutrition._id : null, // Associate the latest nutritional status if available
    });
    await newCheckup.save();

    const populatedCheckup = await MedicalCheckup.findById(newCheckup._id)
      .populate({
        path: "studentProfile",
        populate: {
          path: "classProfile",
        },
      })
      .populate("nutritionalStatus")
      .exec();

    res.status(201).json({ newCheckup: populatedCheckup });
  } catch (error) {
    console.error("Error occurred: ", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Read all medical checkups
router.get("/fetch", authenticateMiddleware, async (req, res) => {
  try {
    const checkups = await MedicalCheckup.find()
      .populate({
        path: "studentProfile",
        populate: { path: "classProfile" },
      })
      .populate("nutritionalStatus") // populate nutritionalStatus
      .exec();
    res.status(200).json(checkups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a medical checkup by ID
router.put("/update/:lrn", authenticateMiddleware, async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({
      lrn: req.params.lrn,
    });

    if (!studentProfile) {
      return res.status(404).json({ error: "StudentProfile not found" });
    }

    const existingCheckup = await MedicalCheckup.findOne({
      studentProfile: studentProfile._id,
    });

    if (!existingCheckup) {
      return res.status(404).json({ error: "Medical checkup not found" });
    }

    // This merges the request body with the existing checkup, only updating the provided fields.
    const updatedData = { ...existingCheckup.toObject(), ...req.body };

    const updatedMedicalCheckup = await MedicalCheckup.findOneAndUpdate(
      {
        studentProfile: studentProfile._id,
      },
      updatedData,
      { new: true }
    ).populate([
      { path: "studentProfile", populate: { path: "classProfile" } },
      "nutritionalStatus",
    ]);

    res.status(200).json(updatedMedicalCheckup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a medical checkup by ID
router.delete("/delete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const checkup = await MedicalCheckup.findByIdAndDelete(req.params.id);

    if (!checkup) return res.status(404).json({ error: "Checkup not found" });

    res.status(200).json({ message: "Checkup deleted" });
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
      .populate("classProfile", "grade section academicYear -_id")
      .select(
        "lrn lastName firstName middleName nameExtension gender age birthDate classProfile -_id"
      );

    if (!students || students.length === 0)
      return res.status(404).json({ error: "No matches found" });

    const studentsWithLatestNutrition = await Promise.all(
      students.map(async (student) => {
        const studentObj = await StudentProfile.findOne({ lrn: student.lrn });
        const latestNutrition = await NutritionalStatus.findOne({
          studentProfile: studentObj,
        }) // Now we are using student's LRN
          .sort({ updatedAt: -1 })
          .select(
            "heightCm weightKg BMI BMIClassification heightForAge beneficiaryOfSBFP"
          );
        return {
          ...student._doc,
          nutritionalStatus: latestNutrition,
        };
      })
    );

    res.status(200).json(studentsWithLatestNutrition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
