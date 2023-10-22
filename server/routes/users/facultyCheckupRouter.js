const express = require("express");
const FacultyCheckup = require("../../models/FacultyCheckupSchema");
const FacultyProfile = require("../../models/FacultyProfileSchema");
const ClassProfile = require("../../models/ClassProfileSchema");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Create a new faculty checkup
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { employeeId, ...medicalData } = req.body;
    const faculty = await FacultyProfile.findOne({ employeeId });
    if (!faculty) return res.status(400).json({ error: "Invalid Faculty ID" });

    const newCheckup = new FacultyCheckup({
      ...medicalData,
      facultyProfile: faculty._id,
    });
    await newCheckup.save();

    const populatedCheckup = await FacultyCheckup.findById(newCheckup._id)
      .populate("facultyProfile")
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
      .exec();
    res.status(200).json(checkups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a faculty checkup by ID
router.put("/update/:facultyId", authenticateMiddleware, async (req, res) => {
  try {
    const faculty = await FacultyProfile.findOne({
      facultyId: req.params.facultyId,
    });

    if (!faculty)
      return res.status(404).json({ error: "Faculty with that ID not found" });

    const updatedCheckup = await FacultyCheckup.findOneAndUpdate(
      { facultyId: faculty._id },
      req.body,
      { new: true }
    ).populate("facultyProfile");

    if (!updatedCheckup)
      return res
        .status(404)
        .json({ error: "Checkup not found for this faculty" });

    res.status(200).json(updatedCheckup);
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
