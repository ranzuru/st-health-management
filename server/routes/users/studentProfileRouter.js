const express = require("express");
const StudentProfile = require("../../models/StudentProfileSchema");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const validateStudent = require("../../middleware/validateStudent");
const exportStudentProfile = require("../../custom/exportStudentProfile.js");
const importStudents = require("../../custom/importStudentProfile.js");
const { createLog } = require("../recordLogRouter.js");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new student profile
router.post(
  "/create",
  authenticateMiddleware,
  validateStudent,
  async (req, res) => {
    try {
      const studentInfo = req.body;

      const newStudent = new StudentProfile({
        ...studentInfo,
      });

      await newStudent.save();
      // LOG DATA AFTER SUCCESSFUL PROCESS
    await createLog('Student Profile', 'CREATE', `${newStudent}`, req.userData.userId);
      res.status(201).json({ newStudent });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all student profiles
router.get("/fetch/:status", authenticateMiddleware, async (req, res) => {
  const { status } = req.params;

  if (!["Active", "Archived", "Inactive"].includes(status)) {
    return res.status(400).json({ error: "Invalid student status." });
  }

  try {
    const students = await StudentProfile.find({ status: status });
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

// Update a student profile
router.put("/update/:lrn", authenticateMiddleware, async (req, res) => {
  try {
    const updateData = req.body;

    const updatedStudent = await StudentProfile.findOneAndUpdate(
      { lrn: req.params.lrn },
      updateData,
      { new: true }
    );

    if (!updatedStudent)
      return res.status(404).json({ error: "Student not found" });

    res.status(200).json({ updatedStudent });
    await createLog('Student Profile', 'UPDATE', `${updatedStudent}`, req.userData.userId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a student profile
router.put("/deleteStudent/:lrn", authenticateMiddleware, async (req, res) => {
  try {
    const studentLrn = req.params.lrn;
    const student = await StudentProfile.findOne({ lrn: studentLrn });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if the student is already inactive
    if (student.status === "Inactive") {
      return res.status(400).json({ error: "Student already inactive" });
    }

    student.status = "Inactive";
    await student.save();
    res.status(200).json({ message: "Student marked as Inactive", student });
    await createLog('Student Profile', 'DELETE', `${student}`, req.userData.userId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/archiveStudent/:lrn", authenticateMiddleware, async (req, res) => {
  try {
    const studentLrn = req.params.lrn;
    const student = await StudentProfile.findOne({ lrn: studentLrn });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if the student is already archived
    if (student.status === "Archived") {
      return res.status(400).json({ error: "Student already archived" });
    }

    student.status = "Archived";
    await student.save();
    res.status(200).json({ message: "Student archived successfully", student });
    await createLog('Student Profile', 'UPDATE', `${student}`, req.userData.userId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put(
  "/reinstateStudent/:lrn",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const studentLrn = req.params.lrn;
      const student = await StudentProfile.findOne({ lrn: studentLrn });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if the student is already active
      if (student.status === "Enrolled") {
        return res.status(400).json({ error: "Student is already active" });
      }

      student.status = "Enrolled";
      await student.save();
      res
        .status(200)
        .json({ message: "Student reinstated successfully", student });
        await createLog('Student Profile', 'UPDATE', `${student}`, req.userData.userId);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/hardDeleteStudent/:lrn",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const studentLrn = req.params.lrn;

      const deleteResult = await StudentProfile.deleteOne({ lrn: studentLrn });

      if (deleteResult.deletedCount === 0) {
        return res
          .status(404)
          .json({ error: "Student not found or already deleted" });
      }

      res.status(200).json({ message: "Student deleted successfully" });
      await createLog('Student Profile', 'DELETE', `${deleteResult}`, req.userData.userId);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/export/:status?", authenticateMiddleware, async (req, res) => {
  const { status } = req.params;

  try {
    const buffer = await exportStudentProfile(status);

    // Set headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=student_profiles${status ? "_" + status : ""}.xlsx`
    );

    res.send(buffer);
  } catch (error) {
    console.error("Export failed", error);
    res.status(500).send(`Error exporting student profiles: ${error.message}`);
  }
});

router.post(
  "/import-students",
  authenticateMiddleware,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const { studentProfiles, errors } = await importStudents(req.file.buffer);

      if (errors.length > 0) {
        const validationErrors = errors
          .filter((error) => !error.errors[0].startsWith("Duplicate LRN"))
          .map((error) => ({
            lrn: error.lrn,
            message: error.errors.join(", "),
          }));

        const duplicateErrors = errors.filter((error) =>
          error.errors[0].startsWith("Duplicate LRN")
        );

        if (validationErrors.length > 0) {
          return res.status(400).json({
            message: "Validation errors encountered during import",
            details: validationErrors,
          });
        }

        if (duplicateErrors.length > 0) {
          return res.status(409).json({
            message: "Duplicate LRN errors encountered during import",
            details: duplicateErrors,
          });
        }
      }
      await createLog('Student Profile', 'IMPORT', `${studentProfiles}`, req.userData.userId);
      return res.status(201).json({
        message: "Data imported successfully",
        importedCount: studentProfiles.length,
      });
    } catch (error) {
      console.log("Server error during import:", error); // Log 7
      return res.status(500).json({
        message: "Server error during import",
        error: error.message,
      });
    }
  }
);

module.exports = router;
