const express = require("express");
const NutritionalStatus = require("../../models/NutritionalStatusSchema");
const StudentProfile = require("../../models/StudentProfileSchema");
const ClassEnrollment = require("../../models/ClassEnrollment");
const MedicalCheckup = require("../../models/MedicalCheckupSchema.js");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Create
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { lrn, measurementType, ...nutritionalData } = req.body;

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

    const existingRecord = await NutritionalStatus.findOne({
      classEnrollment: classEnrollment._id,
      measurementType,
    });

    if (existingRecord) {
      return res.status(400).json({
        error: "A record for this student and measurement type already exists.",
      });
    }

    const newRecord = new NutritionalStatus({
      ...nutritionalData,
      classEnrollment: classEnrollment._id,
      measurementType,
    });

    await newRecord.save();

    const latestPostStatus = await NutritionalStatus.findOne({
      classEnrollment: classEnrollment._id,
      measurementType: "POST",
    })
      .sort({ updatedAt: -1 })
      .exec();

    let latestStatus;
    if (latestPostStatus) {
      latestStatus = latestPostStatus;
    } else {
      const latestPreStatus = await NutritionalStatus.findOne({
        classEnrollment: classEnrollment._id,
        measurementType: "PRE",
      })
        .sort({ updatedAt: -1 })
        .exec();

      latestStatus = latestPreStatus;
    }

    // Once we have the latest status, update the medicalCheckup
    const medicalCheckupToUpdate = await MedicalCheckup.findOne({
      classEnrollment: classEnrollment._id,
    });

    if (medicalCheckupToUpdate) {
      medicalCheckupToUpdate.nutritionalStatus = latestStatus._id;
      await medicalCheckupToUpdate.save();
    }

    const populatedRecord = await NutritionalStatus.findById(newRecord._id)
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
      .exec();

    res.status(201).json({ newRecord: populatedRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read
router.get("/fetch/:type", authenticateMiddleware, async (req, res) => {
  const { type } = req.params;

  if (!["PRE", "POST"].includes(type.toUpperCase())) {
    return res.status(400).json({ error: "Invalid measurement type." });
  }

  try {
    const records = await NutritionalStatus.find({
      measurementType: type.charAt(0).toUpperCase() + type.slice(1),
    }).populate({
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
    });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put(
  "/update/:lrn/:measurementType",
  authenticateMiddleware,
  async (req, res) => {
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
        return res.status(404).json({ error: "Class enrollment not found" });
      }

      const updatedData = { ...req.body };
      const updatedRecord = await NutritionalStatus.findOneAndUpdate(
        {
          classEnrollment: classEnrollment._id,
          measurementType: req.params.measurementType,
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
        .exec();

      if (!updatedRecord) {
        return res
          .status(404)
          .json({ error: "No matching nutritional status record found" });
      }

      const latestPostStatus = await NutritionalStatus.findOne({
        classEnrollment: classEnrollment._id,
        measurementType: "POST",
      })
        .sort({ updatedAt: -1 })
        .exec();

      let latestStatus;
      if (latestPostStatus) {
        latestStatus = latestPostStatus;
      } else {
        const latestPreStatus = await NutritionalStatus.findOne({
          classEnrollment: classEnrollment._id,
          measurementType: "PRE",
        })
          .sort({ updatedAt: -1 })
          .exec();

        latestStatus = latestPreStatus;
      }

      const medicalCheckupToUpdate = await MedicalCheckup.findOne({
        classEnrollment: classEnrollment._id,
      });

      if (medicalCheckupToUpdate) {
        medicalCheckupToUpdate.nutritionalStatus = latestStatus._id;
        await medicalCheckupToUpdate.save();
      }

      res.status(200).json(updatedRecord);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.get("/search/:partialLrn", authenticateMiddleware, async (req, res) => {
  try {
    const partialLrn = req.params.partialLrn;

    const enrollments = await ClassEnrollment.find({
      status: "Active",
    }).populate([
      {
        path: "student",
        match: { lrn: new RegExp(partialLrn, "i") },
        select:
          "lrn lastName firstName middleName nameExtension gender age birthDate address -_id",
      },
      {
        path: "classProfile",
        select: "grade section -_id",
      },
      {
        path: "academicYear",
        select: "schoolYear -_id",
      },
    ]);

    const filteredEnrollments = enrollments.filter(
      (enrollment) => enrollment.student !== null
    );

    if (filteredEnrollments.length === 0)
      return res.status(404).json({ error: "No matches found" });

    const students = filteredEnrollments.map((enrollment) => ({
      ...enrollment.student.toObject(),
      classProfile: enrollment.classProfile,
      academicYear: enrollment.academicYear,
    }));

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete("/delete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const deletedRecord = await NutritionalStatus.findById(req.params.id);

    if (!deletedRecord)
      return res.status(404).json({ error: "Record not found" });

    const classEnrollmentId = deletedRecord.classEnrollment;

    // If the deleted record was a POST
    if (deletedRecord.measurementType === "POST") {
      // Find the latest PRE record
      const latestPreStatus = await NutritionalStatus.findOne({
        classEnrollment: classEnrollmentId,
        measurementType: "PRE",
      })
        .sort({ updatedAt: -1 })
        .exec();

      const medicalCheckupToUpdate = await MedicalCheckup.findOne({
        classEnrollment: classEnrollmentId,
      });

      if (medicalCheckupToUpdate) {
        if (latestPreStatus) {
          // If a PRE record exists, point to it
          medicalCheckupToUpdate.nutritionalStatus = latestPreStatus._id;
        } else {
          // Else set to null or N/A representation
          medicalCheckupToUpdate.nutritionalStatus = null;
        }
        await medicalCheckupToUpdate.save();
      }
    }

    // Now, you can delete the NutritionalStatus record
    await NutritionalStatus.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
