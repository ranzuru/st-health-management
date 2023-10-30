const express = require("express");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const AcademicYear = require("../../models/AcademicYearSchema");

// Helper function for handling errors
const handleError = (error, res) => {
  console.error("An error occurred:", error.message);
  if (error.name === "MongoError" && error.code === 11000) {
    return res.status(409).json({ error: "Duplicate academic year" });
  }
  return res.status(500).json({ error: "Something went wrong" });
};

// Create a new AcademicYear
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { yearFrom, yearTo, ...academicYear } = req.body;

    if (yearFrom > yearTo) {
      return res
        .status(400)
        .json({ error: "YearFrom should be less than YearTo" });
    }

    const newAcademicYear = new AcademicYear({
      yearFrom,
      yearTo,
      ...academicYear,
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
    const { yearFrom, yearTo, monthFrom, monthTo, status } = req.body;

    const academicYear = await AcademicYear.findByIdAndUpdate(
      req.params.id,
      {
        yearFrom,
        yearTo,
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
    const academicYear = await AcademicYear.findByIdAndRemove(req.params.id);
    if (!academicYear)
      return res.status(404).json({ error: "AcademicYear not found" });
    res.json({ message: "AcademicYear deleted" });
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
