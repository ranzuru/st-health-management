const express = require("express");
const FacultyCheckup = require("../../models/FacultyCheckupSchema");
const FacultyProfile = require("../../models/FacultyProfileSchema");
const ClassProfile = require("../../models/ClassProfileSchema");
const AcademicYear = require("../../models/AcademicYearSchema.js");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const { createLog } = require("../recordLogRouter.js");
const importFacultyMedical = require("../../custom/importFacultyMedical.js");

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new faculty checkup
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { employeeId, schoolYear, ...MedicalData } = req.body;

    const faculty = await FacultyProfile.findOne({ employeeId });
    if (!faculty) return res.status(400).json({ error: "Invalid Faculty ID" });

    const academic = await AcademicYear.findOne({ schoolYear });
    if (!academic)
      return res.status(400).json({ error: "Invalid School Year" });

    const existingCheckup = await FacultyCheckup.findOne({
      facultyProfile: faculty._id,
      academicYear: academic._id,
    });

    if (existingCheckup) {
      return res.status(400).json({
        error: "Checkup for the given Faculty and Academic Year already exists",
      });
    }

    const newCheckup = new FacultyCheckup({
      ...MedicalData,
      facultyProfile: faculty._id,
      academicYear: academic._id,
    });
    await newCheckup.save();
    await createLog('Faculty Medical', 'CREATE', `${newCheckup}`, req.userData.userId);
    const populatedCheckup = await FacultyCheckup.findById(newCheckup._id)
      .populate("facultyProfile")
      .populate("academicYear")
      .exec();

    res.status(201).json({ newCheckup: populatedCheckup });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all faculty checkup
router.get("/fetch/:status", authenticateMiddleware, async (req, res) => {
  const { status } = req.params;

  if (!["Active", "Archived", "Inactive"].includes(status)) {
    return res.status(400).json({ error: "Invalid student status." });
  }

  try {
    const records = await FacultyCheckup.find({
      status: status,
    })
      .populate("facultyProfile")
      .populate("academicYear")
      .exec();

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a faculty checkup by ID
router.put("/update/:employeeId", authenticateMiddleware, async (req, res) => {
  try {
    const facultyProfile = await FacultyProfile.findOne({
      employeeId: req.params.employeeId,
    });

    if (!facultyProfile) {
      return res.status(404).json({ error: "FacultyProfile not found" });
    }

    const academicYearRecord = await AcademicYear.findOne({
      schoolYear: req.body.schoolYear,
    });

    if (!academicYearRecord) {
      return res
        .status(404)
        .json({ error: "Specified academic year not found" });
    }

    const existingFacultyCheckup = await FacultyCheckup.findOne({
      facultyProfile: facultyProfile._id,
      academicYear: academicYearRecord._id,
    });

    if (!existingFacultyCheckup) {
      return res
        .status(404)
        .json({ error: "Faculty checkup not found for this academic year" });
    }

    const updatedData = { ...existingFacultyCheckup.toObject(), ...req.body };

    const updatedFacultyCheckup = await FacultyCheckup.findOneAndUpdate(
      {
        facultyProfile: facultyProfile._id,
        academicYear: academicYearRecord._id,
      },
      updatedData,
      { new: true }
    )
      .populate("facultyProfile")
      .populate("academicYear");

    res.status(200).json(updatedFacultyCheckup);
    await createLog('Faculty Medical', 'UPDATE', `${updatedFacultyCheckup}`, req.userData.userId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/archive/:recordId", authenticateMiddleware, async (req, res) => {
  try {
    const facultyCheckupRecord = await FacultyCheckup.findById(
      req.params.recordId
    );

    if (!facultyCheckupRecord) {
      return res
        .status(404)
        .json({ error: "Medical checkup record not found" });
    }

    // Check if the medical checkup record is already archived
    if (facultyCheckupRecord.status === "Archived") {
      return res.status(400).json({ error: "Record is already archived" });
    }

    facultyCheckupRecord.status = "Archived";
    await facultyCheckupRecord.save();
    res.status(200).json({
      message: "Medical checkup record marked as Archived",
      facultyCheckupRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/reinstate/:recordId", authenticateMiddleware, async (req, res) => {
  try {
    const facultyCheckupRecord = await FacultyCheckup.findById(
      req.params.recordId
    );

    if (!facultyCheckupRecord) {
      return res
        .status(404)
        .json({ error: "Medical checkup record not found" });
    }

    // Check if the medical checkup record is already active
    if (facultyCheckupRecord.status === "Active") {
      return res.status(400).json({ error: "Record is already active" });
    }

    facultyCheckupRecord.status = "Active";
    await facultyCheckupRecord.save();
    res.status(200).json({
      message: "Medical checkup record reinstated to Active status",
      facultyCheckupRecord,
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
      const facultyCheckupRecord = await FacultyCheckup.findById(
        req.params.recordId
      );

      if (!facultyCheckupRecord) {
        return res
          .status(404)
          .json({ error: "Medical checkup record not found" });
      }

      // Check if the medical checkup record is already inactive
      if (facultyCheckupRecord.status === "Inactive") {
        return res.status(400).json({ error: "Record is already inactive" });
      }

      facultyCheckupRecord.status = "Inactive";
      await facultyCheckupRecord.save();
      res.status(200).json({
        message: "Medical checkup record marked as Inactive",
        facultyCheckupRecord,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete a faculty checkup by ID
router.delete("/hardDelete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const checkup = await FacultyCheckup.findByIdAndDelete(req.params.id);
    if (!checkup) return res.status(404).json({ error: "Checkup not found" });
    res.status(200).json({ message: "Checkup deleted" });
    await createLog('Faculty Medical', 'DELETE', `${checkup}`, req.userData.userId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/search/:employeeIdInput",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const employeeIdInput = req.params.employeeIdInput;
      const facultyMembers = await FacultyProfile.find({
        employeeId: new RegExp(employeeIdInput, "i"),
        status: "Active",
      }).select(
        "employeeId lastName firstName middleName nameExtension gender age birthDate -_id"
      );

      if (!facultyMembers || facultyMembers.length === 0)
        return res.status(404).json({ error: "No matches found" });

      const facultyWithClassProfile = await Promise.all(
        facultyMembers.map(async (faculty) => {
          const studentObj = await FacultyProfile.findOne({
            employeeId: faculty.employeeId,
          });
          const classInfo = await ClassProfile.findOne({
            facultyProfile: studentObj,
          }).select("academicYear -_id");
          return {
            ...faculty._doc,
            classProfile: classInfo,
          };
        })
      );

      res.status(200).json(facultyWithClassProfile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/import-medical", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file provided" });
  }

  try {
    const { checkups, errors } = await importFacultyMedical(req.file.buffer);
    // Check if there were any errors during the import
    if (errors.length > 0) {
      return res.status(422).json({
        message: "Some records could not be imported due to errors",
        errors: errors,
      });
    }

    // If no errors, send a success response
    return res.status(201).json({
      message: "Faculty medical records imported successfully",
      checkups: checkups,
    });
  } catch (error) {
    // Generic error handling
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

router.post("/deleteAll", async (req, res) => {
  try {
    const employeeIdsToKeep = [
      "12313",
      "12323445",
      "124231312",
      "1111111",
      "2212312",
      "A1B2",
      "E1234",
      "121213344",
    ];

    const result = await FacultyProfile.deleteMany({
      employeeId: { $nin: employeeIdsToKeep },
    });

    console.log(`Deleted ${result.deletedCount} faculty records.`);
    res.send(`Deleted ${result.deletedCount} faculty records.`);
  } catch (err) {
    console.error("Error deleting faculty records:", err);
    res.status(500).send("An error occurred while deleting faculty records.");
  }
});

module.exports = router;
