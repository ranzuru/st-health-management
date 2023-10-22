const express = require("express");
const router = express.Router();
const MedicalCheckup = require("../../models/MedicalCheckupSchema");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

router.get(
  "/dewormingReportCount",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const report = await MedicalCheckup.aggregate([
        {
          $match: { deworming: true },
        },
        {
          $lookup: {
            from: "studentprofiles",
            localField: "studentProfile",
            foreignField: "_id",
            as: "studentDetails",
          },
        },
        {
          $unwind: "$studentDetails",
        },
        {
          $lookup: {
            from: "classprofiles",
            localField: "studentDetails.classProfile",
            foreignField: "_id",
            as: "classDetails",
          },
        },
        {
          $unwind: "$classDetails",
        },
        {
          $group: {
            _id: "$classDetails.grade",
            total: { $sum: 1 },
            male4P: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$studentDetails.gender", "Male"] },
                      { $eq: ["$studentDetails.is4p", true] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            female4P: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$studentDetails.gender", "Female"] },
                      { $eq: ["$studentDetails.is4p", true] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            maleNon4P: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$studentDetails.gender", "Male"] },
                      { $eq: ["$studentDetails.is4p", false] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            femaleNon4P: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$studentDetails.gender", "Female"] },
                      { $eq: ["$studentDetails.is4p", false] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by grade level
        },
      ]);
      res.json(report);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
