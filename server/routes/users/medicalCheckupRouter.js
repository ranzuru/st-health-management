const express = require("express");
const MedicalCheckup = require("../../models/MedicalCheckupSchema");
const StudentProfile = require("../../models/StudentProfileSchema");
const NutritionalStatus = require("../../models/NutritionalStatusSchema");
const ClassEnrollment = require("../../models/ClassEnrollment");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const { createLog } = require("../recordLogRouter.js");
const importStudentMedical = require("../../custom/importStudentMedical.js");

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    await createLog('Student Medical', 'CREATE', `${newCheckup}`, req.userData.userId);
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
router.get("/fetch/:status", authenticateMiddleware, async (req, res) => {
  const { status } = req.params;

  // List of valid statuses - adjust these as per your application's logic
  const validStatuses = ["Active", "Archived", "Inactive"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid student status." });
  }

  try {
    const checkups = await MedicalCheckup.find({ status: status })
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
    await createLog('Student Medical', 'UPDATE', `${updatedMedicalCheckup}`, req.userData.userId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/archive/:recordId", authenticateMiddleware, async (req, res) => {
  try {
    const medicalCheckupRecord = await MedicalCheckup.findById(
      req.params.recordId
    );

    if (!medicalCheckupRecord) {
      return res
        .status(404)
        .json({ error: "Medical checkup record not found" });
    }

    // Check if the medical checkup record is already archived
    if (medicalCheckupRecord.status === "Archived") {
      return res.status(400).json({ error: "Record already archived" });
    }

    medicalCheckupRecord.status = "Archived";
    await medicalCheckupRecord.save();
    res.status(200).json({
      message: "Medical checkup record marked as Archived",
      medicalCheckupRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/reinstate/:recordId", authenticateMiddleware, async (req, res) => {
  try {
    const medicalCheckupRecord = await MedicalCheckup.findById(
      req.params.recordId
    );

    if (!medicalCheckupRecord) {
      return res
        .status(404)
        .json({ error: "Medical checkup record not found" });
    }

    // Check if the medical checkup record is already active
    if (medicalCheckupRecord.status === "Active") {
      return res.status(400).json({ error: "Record is already active" });
    }

    medicalCheckupRecord.status = "Active";
    await medicalCheckupRecord.save();
    res.status(200).json({
      message: "Medical checkup record reinstated to Active status",
      medicalCheckupRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put(
  "/softDelete/:recordId",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const medicalCheckupRecord = await MedicalCheckup.findById(
        req.params.recordId
      );

      if (!medicalCheckupRecord) {
        return res
          .status(404)
          .json({ error: "Medical checkup record not found" });
      }

      // Check if the medical checkup record is already inactive
      if (medicalCheckupRecord.status === "Inactive") {
        return res.status(400).json({ error: "Record is already inactive" });
      }

      medicalCheckupRecord.status = "Inactive";
      await medicalCheckupRecord.save();
      res.status(200).json({
        message: "Medical checkup record marked as Inactive",
        medicalCheckupRecord,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete a medical checkup by ID
router.delete("/delete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const checkup = await MedicalCheckup.findByIdAndDelete(req.params.id);

    if (!checkup) return res.status(404).json({ error: "Checkup not found" });

    res.status(200).json({ message: "Checkup deleted" });
    await createLog('Student Medical', 'DELETE', `${checkup}`, req.userData.userId);
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

router.post(
  "/import-student-medical",
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: "No file provided" });
    }

    try {
      const { checkups, errors, hasMoreErrors } = await importStudentMedical(
        req.file.buffer
      );

      // Check if there were any errors during the import
      if (errors.length > 0) {
        return res.status(422).json({
          message:
            "Some student medical records could not be imported due to errors",
          errors: errors,
          hasMoreErrors: hasMoreErrors,
        });
      }

      // If no errors, send a success response
      return res.status(201).json({
        message: "Student medical records imported successfully",
        checkups: checkups,
      });
    } catch (error) {
      // Generic error handling
      res.status(500).send({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
