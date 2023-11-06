const express = require("express");
const MedicalCheckup = require("../../models/MedicalCheckupSchema");
const StudentProfile = require("../../models/StudentProfileSchema");
const NutritionalStatus = require("../../models/NutritionalStatusSchema");
const ClassEnrollment = require("../../models/ClassEnrollment");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Create a new medical checkup
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { lrn, checkupType, ...medicalData } = req.body;

    const student = await StudentProfile.findOne({ lrn });
    if (!student) return res.status(400).json({ error: "Invalid LRN" });

    const classEnrollment = await ClassEnrollment.findOne({
      student: student._id,
    }).exec();

    if (!classEnrollment) {
      return res
        .status(400)
        .json({ error: "Student is not enrolled in any class" });
    }

    // Fetch the latest nutritional status for the student
    const latestNutrition = await NutritionalStatus.findOne({
      classEnrollment: classEnrollment._id,
    }).sort({ updatedAt: -1 });

    const newCheckup = new MedicalCheckup({
      ...medicalData,
      classEnrollment: classEnrollment._id,
      nutritionalStatus: latestNutrition ? latestNutrition._id : null,
      checkupType,
    });
    await newCheckup.save();

    const populatedCheckup = await MedicalCheckup.findById(newCheckup._id)
      .populate({
        path: "classEnrollment",
        populate: [
          {
            path: "student",
          },
          {
            path: "classProfile",
          },
          {
            path: "academicYear",
          },
        ],
      })
      .populate("nutritionalStatus")
      .exec();

    res.status(201).json({ newCheckup: populatedCheckup });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Student already has a checkup record for this school year.",
      });
    }
    res.status(400).json({ error: error.message });
  }
});

// Read all medical checkups
router.get("/fetch", authenticateMiddleware, async (req, res) => {
  try {
    const checkups = await MedicalCheckup.find()
      .populate({
        path: "classEnrollment",
        populate: [
          { path: "student" },
          { path: "classProfile" },
          { path: "academicYear" },
        ],
      })
      .populate("nutritionalStatus")
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

    const classEnrollment = await ClassEnrollment.findOne({
      student: studentProfile._id,
    });

    if (!classEnrollment) {
      return res.status(404).json({ error: "Class Enrollment not found" });
    }

    const existingCheckup = await MedicalCheckup.findOne({
      classEnrollment: classEnrollment._id,
    });

    if (!existingCheckup) {
      return res.status(404).json({ error: "Medical checkup not found" });
    }

    const updatedData = { ...existingCheckup.toObject(), ...req.body };

    const updatedMedicalCheckup = await MedicalCheckup.findOneAndUpdate(
      {
        classEnrollment: classEnrollment._id,
      },
      updatedData,
      { new: true }
    )
      .populate({
        path: "classEnrollment",
        populate: [
          { path: "student" },
          { path: "classProfile" },
          { path: "academicYear" },
        ],
      })
      .populate("nutritionalStatus");

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
  const { partialLrn } = req.params;

  if (!partialLrn || partialLrn.trim().length < 3) {
    return res.status(400).json({ error: "Invalid LRN provided." });
  }

  try {
    const enrollments = await ClassEnrollment.find({
      status: "Active",
    })
      .populate({
        path: "student",
        match: { lrn: new RegExp(partialLrn, "i") },
        select:
          "lrn lastName firstName middleName nameExtension gender age birthDate address -_id",
      })
      .populate({
        path: "classProfile",
        select: "grade section -_id",
      })
      .populate({
        path: "academicYear",
        select: "schoolYear -_id",
      })
      .lean(); // Using lean() to get plain JS objects

    const studentsWithLatestNutrition = await Promise.all(
      enrollments
        .filter((enrollment) => enrollment.student)
        .map(async (enrollment) => {
          const latestNutritionalStatus = await NutritionalStatus.findOne({
            classEnrollment: enrollment._id,
          })
            .sort({ updatedAt: -1 })
            .select(
              "weightKg heightCm BMI BMIClassification heightForAge beneficiaryOfSBFP"
            )
            .lean();

          return {
            ...enrollment.student,
            classProfile: enrollment.classProfile,
            academicYear: enrollment.academicYear,
            nutritionalStatus: latestNutritionalStatus || null,
            warning: latestNutritionalStatus
              ? null
              : "Please add data in the nutritionalStatus module for better record keeping.",
          };
        })
    );

    const hasWarning = studentsWithLatestNutrition.some(
      (student) => student.warning
    );

    if (!studentsWithLatestNutrition.length) {
      return res.status(404).json({ error: "No matches found" });
    }

    const responseObject = {
      data: studentsWithLatestNutrition,
      ...(hasWarning && {
        message:
          "Some students lack nutritionalStatus data. Please check and update accordingly.",
      }),
    };

    res.status(200).json(responseObject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
