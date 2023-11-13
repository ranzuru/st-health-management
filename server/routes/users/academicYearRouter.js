const express = require("express");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const AcademicYear = require("../../models/AcademicYearSchema");
const { createLog } = require("../recordLogRouter.js");
const ClassEnrollment = require("../../models/ClassEnrollment");
const DengueMonitoring = require("../../models/DengueSchema.js");
const NutritionalStatus = require("../../models/NutritionalStatusSchema.js");
const FacultyCheckup = require("../../models/FacultyProfileSchema.js");
const mongoose = require("mongoose");

// Helper function for handling errors
const handleError = (error, res) => {
  console.error("An error occurred:", error.message);
  if (error.name === "MongoError" && error.code === 11000) {
    return res.status(409).json({ error: "Duplicate academic year" });
  } else if (error.message === "There can only be one active AcademicYear.") {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Something went wrong" });
};

// Create a new AcademicYear
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { schoolYear, ...academicYearData } = req.body;
    const [startYear, endYear] = schoolYear.split("-").map(Number);

    if (startYear >= endYear) {
      return res
        .status(400)
        .json({ error: "Start year should be less than end year" });
    }

    const newAcademicYear = new AcademicYear({
      schoolYear,
      ...academicYearData,
    });

    await newAcademicYear.save();
    res.status(201).json({ newAcademicYear });
    await createLog('Academic Year', 'CREATE', `${newAcademicYear}`, req.userData.userId);
  } catch (error) {
    handleError(error, res);
  }
});

// Get all AcademicYears
router.get("/fetch", authenticateMiddleware, async (req, res) => {
  try {
    const academicYears = await AcademicYear.find();
    res.json(academicYears);
  } catch (error) {
    handleError(error, res);
  }
});

// Get a single AcademicYear by ID
router.get("/fetch/:id", authenticateMiddleware, async (req, res) => {
  try {
    const academicYear = await AcademicYear.findById(req.params.id);
    if (!academicYear)
      return res.status(404).json({ error: "AcademicYear not found" });
    res.json(academicYear);
  } catch (error) {
    handleError(error, res);
  }
});

// Update an AcademicYear by ID
router.put("/update/:id", authenticateMiddleware, async (req, res) => {
  try {
    const { schoolYear, monthFrom, monthTo, status } = req.body;
    const [startYear, endYear] = schoolYear.split("-").map(Number);

    if (startYear >= endYear) {
      return res
        .status(400)
        .json({ error: "Start year should be less than end year" });
    }

    const academicYear = await AcademicYear.findByIdAndUpdate(
      req.params.id,
      {
        schoolYear,
        monthFrom,
        monthTo,
        status,
      },
      { new: true }
    );

    if (!academicYear)
      return res.status(404).json({ error: "AcademicYear not found" });
    res.json({ academicYear });
    await createLog('Academic Year', 'UPDATE', `${academicYear}`, req.userData.userId);
  } catch (error) {
    handleError(error, res);
  }
});

// Delete an AcademicYear by ID
router.delete("/delete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const academicYear = await AcademicYear.findOne({ _id: req.params.id });

    if (!academicYear)
      return res.status(404).json({ error: "AcademicYear not found" });

    const count = await ClassEnrollment.countDocuments({
      academicYear: academicYear._id,
    });
    if (count > 0) {
      return res.status(400).json({
        error:
          "Cannot delete AcademicYear because it is referenced by ClassEnrollment documents.",
      });
    }

    await academicYear.deleteOne(); // Use deleteOne() on the instance
    await createLog('Academic Year', 'DELETE', `${academicYear}`, req.userData.userId);
    res.json({ message: "AcademicYear deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
});

router.put("/complete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const academicYear = await AcademicYear.findOne({ _id: req.params.id });

    if (!academicYear) {
      return res.status(404).json({ error: "AcademicYear not found" });
    }

    // Begin a session for a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update the status of the AcademicYear to 'Completed'
      academicYear.status = "Completed";
      await academicYear.save({ session });

      // Find all ClassEnrollments related to this academic year
      const classEnrollments = await ClassEnrollment.find(
        { academicYear: academicYear._id },
        "_id",
        { session }
      );

      const classEnrollmentIds = classEnrollments.map(
        (enrollment) => enrollment._id
      );

      // Update the status of all related ClassEnrollment documents to 'Archived'
      await ClassEnrollment.updateMany(
        { academicYear: academicYear._id },
        { $set: { status: "Archived" } },
        { session }
      );

      // Update the status of all related DengueMonitoring documents to 'Archived'
      await DengueMonitoring.updateMany(
        { classEnrollment: { $in: classEnrollmentIds } },
        { $set: { status: "Archived" } },
        { session }
      );

      // Update the status of all related NutritionalStatus documents to 'Archived'
      await NutritionalStatus.updateMany(
        { classEnrollment: { $in: classEnrollmentIds } },
        { $set: { status: "Archived" } },
        { session }
      );

      // Update the status of all related FacultyCheckup documents to 'Archived'
      await FacultyCheckup.updateMany(
        { academicYear: academicYear._id },
        { $set: { status: "Archived" } },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();

      res.json({
        message:
          "AcademicYear, ClassEnrollment, DengueMonitoring, NutritionalStatus, and FacultyCheckup records archived successfully",
      });
    } catch (error) {
      // If an error occurs, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
