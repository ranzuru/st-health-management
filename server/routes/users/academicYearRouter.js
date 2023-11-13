const express = require("express");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const AcademicYear = require("../../models/AcademicYearSchema");
const ClassEnrollment = require("../../models/ClassEnrollment");

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
    res.json({ message: "AcademicYear deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
