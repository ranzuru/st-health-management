const express = require("express");
const ClassEnrollment = require("../../models/ClassEnrollment");
const StudentProfile = require("../../models/StudentProfileSchema");
const ClassProfile = require("../../models/ClassProfileSchema");
const AcademicYear = require("../../models/AcademicYearSchema");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const exportClassEnrollmentData = require("../../custom/exportEnrollment.js");
const importClassEnrollments = require("../../custom/importEnrollment.js");
const { translateFiltersToMongoQuery } = require("../../utils/filterUtils.js");
const multer = require("multer");
const { createLog } = require("../recordLogRouter.js");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { lrn, grade, section, schoolYear, ...enrollmentData } = req.body;

    // Find the student based on LRN
    const student = await StudentProfile.findOne({ lrn });
    if (!student) return res.status(400).json({ error: "Invalid LRN" });

    const classDetails = await ClassProfile.findOne({ grade, section });
    if (!classDetails)
      return res.status(400).json({ error: "Invalid grade or section" });
    // Find academicYear using schoolYear
    const academicDetails = await AcademicYear.findOne({ schoolYear });
    if (!academicDetails)
      return res.status(400).json({ error: "Invalid school year" });

    // Create new Class Enrollment
    const newEnrollment = new ClassEnrollment({
      ...enrollmentData,
      student: student._id,
      classProfile: classDetails._id,
      academicYear: academicDetails._id,
    });

    await newEnrollment.save();
    await createLog('Class Assignment', 'CREATE', `${newEnrollment}`, req.userData.userId);
    // Populate and return the newly created enrollment
    const populatedEnrollment = await ClassEnrollment.findById(
      newEnrollment._id
    )
      .populate({
        path: "student",
        model: "StudentProfile", // Assuming you have a StudentProfile model
      })
      .populate({
        path: "classProfile",
        model: "ClassProfile", // Your ClassProfile model
        populate: {
          path: "faculty",
          model: "FacultyProfile", // To populate the faculty details from FacultyProfile model
        },
      })
      .populate({
        path: "academicYear",
        model: "AcademicYear", // Assuming you have an AcademicYear model
      })
      .exec();

    res.status(201).json({ newEnrollment: populatedEnrollment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error:
          "A record for this student already exists for the given academic year.",
      });
    }
    res.status(400).json({ error: error.message });
  }
});

router.get("/fetch/:status", authenticateMiddleware, async (req, res) => {
  const { status } = req.params;

  if (!["Active", "Archived", "Inactive"].includes(status)) {
    return res.status(400).json({ error: "Invalid enrollment status." });
  }

  try {
    const enrollments = await ClassEnrollment.find({ status: status })
      .populate("student")
      .populate({
        path: "classProfile",
        populate: {
          path: "faculty",
          model: "FacultyProfile",
        },
      })
      .populate("academicYear")
      .exec();

    res.status(200).json({ enrollments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search/:partialLrn", authenticateMiddleware, async (req, res) => {
  try {
    const partialLrn = req.params.partialLrn;
    const students = await StudentProfile.find({
      lrn: new RegExp(partialLrn, "i"),
      status: "Active",
    }).select(
      "lrn lastName firstName middleName nameExtension gender age birthDate -_id"
    );

    if (!students || students.length === 0)
      return res.status(404).json({ error: "No matches found" });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/fetchActiveSchoolYears",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const activeSchoolYears = await AcademicYear.find(
        { status: "Active" },
        { schoolYear: 1, _id: 0 }
      );

      res.json(activeSchoolYears.map((item) => item.schoolYear));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/fetchGradesAndSections",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const gradesAndSections = await ClassProfile.find({
        status: "Active",
      }).select("grade section lastName firstName -_id");

      if (!gradesAndSections || gradesAndSections.length === 0) {
        return res
          .status(404)
          .json({ error: "No active grades and sections found" });
      }

      res.status(200).json(gradesAndSections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put("/update/:lrn", authenticateMiddleware, async (req, res) => {
  try {
    const studentLRN = req.params.lrn;
    const { grade, section, schoolYear, ...enrollmentData } = req.body;

    // Fetch enrollment using student's LRN
    const student = await StudentProfile.findOne({ lrn: studentLRN });
    if (!student) return res.status(400).json({ error: "Invalid LRN" });

    const enrollmentToUpdate = await ClassEnrollment.findOne({
      student: student._id,
    });
    if (!enrollmentToUpdate) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    if (grade && section) {
      const classDetails = await ClassProfile.findOne({ grade, section });
      if (!classDetails)
        return res.status(400).json({ error: "Invalid grade or section" });
      enrollmentToUpdate.classProfile = classDetails._id;
    }

    if (schoolYear) {
      const academicDetails = await AcademicYear.findOne({ schoolYear });
      if (!academicDetails)
        return res.status(400).json({ error: "Invalid school year" });
      enrollmentToUpdate.academicYear = academicDetails._id;
    }

    Object.assign(enrollmentToUpdate, enrollmentData);
    await enrollmentToUpdate.save();
    await createLog('Class Assignment', 'UPDATE', `${enrollmentToUpdate}`, req.userData.userId);
    const populatedEnrollment = await ClassEnrollment.findById(
      enrollmentToUpdate._id
    )
      .populate({
        path: "student",
        model: "StudentProfile", // Assuming you have a StudentProfile model
      })
      .populate({
        path: "academicYear",
        model: "AcademicYear", // Assuming you have an AcademicYear model
      })
      .populate({
        path: "classProfile",
        model: "ClassProfile", // You have this model
        populate: {
          path: "faculty",
          model: "FacultyProfile", // To get the faculty details
        },
      });

    res.status(200).json({
      message: "Updated successfully",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/softDelete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const enrollmentId = req.params.id;
    const enrollment = await ClassEnrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Check if the enrollment is already inactive
    if (enrollment.status === "Inactive") {
      return res.status(400).json({ error: "Enrollment already inactive" });
    }

    enrollment.status = "Inactive";
    await enrollment.save();
    res.status(200).json({ message: "Soft deleted successfully", enrollment });
    await createLog('Class Assignment', 'DELETE', `${enrollment}`, req.userData.userId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await ClassEnrollment.countDocuments({ status: "Active" });
    res.json({ count });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.put(
  "/archiveClassEnrollment/:enrollmentId",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const enrollmentId = req.params.enrollmentId;

      // Find the class enrollment by ID
      const enrollment = await ClassEnrollment.findById(enrollmentId);

      if (!enrollment) {
        return res.status(404).json({ error: "Class enrollment not found" });
      }

      // Check if the class enrollment is already archived
      if (enrollment.status === "Archived") {
        return res
          .status(400)
          .json({ error: "Class enrollment already archived" });
      }

      // Archive the class enrollment
      enrollment.status = "Archived";
      await enrollment.save();

      res.status(200).json({
        message: "Class enrollment archived successfully",
        enrollment,
      });
      await createLog('Class Assignment', 'UPDATE', `${enrollment}`, req.userData.userId);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Reinstate Class Enrollment by ID
router.put(
  "/reinstateClassEnrollment/:enrollmentId",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const enrollmentId = req.params.enrollmentId;

      // Find the class enrollment by ID
      const enrollment = await ClassEnrollment.findById(enrollmentId);

      if (!enrollment) {
        return res.status(404).json({ error: "Class enrollment not found" });
      }

      // Check if the class enrollment is already active
      if (enrollment.status === "Active") {
        return res
          .status(400)
          .json({ error: "Class enrollment is already active" });
      }

      // Reinstate the class enrollment
      enrollment.status = "Active";
      await enrollment.save();

      res.status(200).json({
        message: "Class enrollment reinstated successfully",
        enrollment,
      });
      await createLog('Class Assignment', 'UPDATE', `${enrollment}`, req.userData.userId);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/export/:status?", authenticateMiddleware, async (req, res) => {
  const { status } = req.params;
  console.log("Status:", status);
  const filters = req.query.filters ? JSON.parse(req.query.filters) : null;
  console.log("Received filters:", filters);
  try {
    const filtersQuery = filters ? translateFiltersToMongoQuery(filters) : {};
    console.log("Translated filtersQuery:", filtersQuery);

    const buffer = await exportClassEnrollmentData(status, filtersQuery);

    // Set the headers to prompt a download with a proper file name.
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=classEnrollment-records.xlsx"
    );

    // Send the buffer.
    res.send(buffer);
  } catch (error) {
    // Error handling
    console.error("Failed to export Dengue Monitoring data:", error);
    res.status(500).send("Error when trying to export data");
  }
});

router.post("/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file provided" });
  }

  try {
    const { enrollments, errors } = await importClassEnrollments(
      req.file.buffer
    );

    // Check if there were any errors during the import
    if (errors.length > 0) {
      // Respond with a 422 Unprocessable Entity, sending back the errors
      return res.status(422).json({
        message: "Some records could not be imported due to errors",
        errors: errors,
      });
    }
    await createLog('Class Assignment', 'CREATE', `${enrollments}`, req.userData.userId);
    // If no errors, send a success response
    return res.status(201).json({
      message: "Enrollments imported successfully",
      enrollments: enrollments,
    });
  } catch (error) {
    // Generic error handling for any other errors not caught by the import function
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

module.exports = router;
