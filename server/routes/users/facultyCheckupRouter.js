const express = require("express");
const FacultyCheckup = require("../../models/FacultyCheckupSchema");
const FacultyProfile = require("../../models/FacultyProfileSchema");
const ClassProfile = require("../../models/ClassProfileSchema");
const AcademicYear = require("../../models/AcademicYearSchema.js");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Create a new faculty checkup
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { employeeId, schoolYear, ...medicalData } = req.body;

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
      ...medicalData,
      facultyProfile: faculty._id,
      academicYear: academic._id,
    });
    await newCheckup.save();

    const populatedCheckup = await FacultyCheckup.findById(newCheckup._id)
      .populate("facultyProfile")
      .populate("academicYear")
      .exec();

    res.status(201).json({ newCheckup: populatedCheckup });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all faculty checkups
router.get("/fetch", authenticateMiddleware, async (req, res) => {
  try {
    const checkups = await FacultyCheckup.find()
      .populate("facultyProfile")
      .populate("academicYear")
      .exec();

    // Use Promise.all to fetch all the ClassProfiles related to each facultyProfile
    const checkupsWithClass = await Promise.all(
      checkups.map(async (newCheckup) => {
        const classProfile = await ClassProfile.findOne({
          faculty: newCheckup.facultyProfile._id,
        });
        // Add grade and section to the returned checkup object
        return {
          ...newCheckup._doc,
          grade: classProfile ? classProfile.grade : null,
          section: classProfile ? classProfile.section : null,
        };
      })
    );

    res.status(200).json(checkupsWithClass);
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
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a faculty checkup by ID
router.delete("/delete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const checkup = await FacultyCheckup.findByIdAndDelete(req.params.id);
    if (!checkup) return res.status(404).json({ error: "Checkup not found" });
    res.status(200).json({ message: "Checkup deleted" });
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

module.exports = router;
