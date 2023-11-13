const express = require("express");
const router = express.Router();
const MedicalCheckup = require("../../models/MedicalCheckupSchema");
const AcademicYear = require("../../models/AcademicYearSchema");
const ClassEnrollment = require("../../models/ClassEnrollment");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const { createLog } = require("../recordLogRouter.js");

router.get("/dewormingData", authenticateMiddleware, async (req, res) => {
  try {
    const latestAcademicYear = await AcademicYear.findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    const academicYearId = latestAcademicYear._id;

    const enrollmentCounts = await getEnrollmentCounts(academicYearId);
    const dewormedCounts = await getDewormedCounts(academicYearId);
    const result = combineData(enrollmentCounts, dewormedCounts);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching deworming data:", error);
    res.status(500).json({ error: "Failed to fetch deworming data" });
  }
});

// move these functions outside of the router, maybe to a separate service/utility file
async function getEnrollmentCounts(academicYearId) {
  const enrollmentCounts = await ClassEnrollment.aggregate([
    { $match: { academicYear: academicYearId, status: "Active" } },
    {
      $lookup: {
        from: "studentprofiles",
        localField: "student",
        foreignField: "_id",
        as: "studentProfile",
      },
    },
    { $unwind: "$studentProfile" },
    {
      $group: {
        _id: {
          grade: "$classProfile",
          gender: "$studentProfile.gender",
          is4P: "$studentProfile.is4p",
        },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "classprofiles",
        localField: "_id.grade",
        foreignField: "_id",
        as: "classProfile",
      },
    },
    { $unwind: "$classProfile" },
  ]);
  return enrollmentCounts;
}

async function getDewormedCounts(academicYearId) {
  const dewormedCounts = await MedicalCheckup.aggregate([
    {
      $lookup: {
        from: "classenrollments",
        localField: "classEnrollment",
        foreignField: "_id",
        as: "enrollment",
      },
    },
    { $unwind: "$enrollment" },
    {
      $lookup: {
        from: "studentprofiles",
        localField: "enrollment.student",
        foreignField: "_id",
        as: "studentProfile",
      },
    },
    { $unwind: "$studentProfile" },
    { $match: { "enrollment.academicYear": academicYearId, deworming: true } },
    {
      $group: {
        _id: {
          grade: "$enrollment.classProfile",
          gender: "$studentProfile.gender",
          is4P: "$studentProfile.is4p",
        },
        count: { $sum: 1 },
      },
    },
  ]);
  // Before returning dewormedCounts

  return dewormedCounts;
}

function combineData(enrollmentCounts, dewormedCounts) {
  const result = [];
  enrollmentCounts.forEach((enrollment) => {
    const dewormedData = dewormedCounts.find(
      (item) =>
        item._id.grade.equals(enrollment._id.grade) &&
        item._id.gender === enrollment._id.gender &&
        item._id.is4P === enrollment._id.is4P
    );

    result.push({
      grade: enrollment.classProfile.grade,
      gender: enrollment._id.gender,
      is4P: enrollment._id.is4P,
      totalEnrolled: enrollment.count,
      totalDewormed: dewormedData ? dewormedData.count : 0,
    });
  });
  return result;
}

router.get("/validateDeworming", async (req, res) => {
  try {
    const count = await MedicalCheckup.countDocuments({ deworming: true });
    res.json({ dewormedCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

module.exports = router;
