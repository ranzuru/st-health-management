const express = require("express");
const DengueMonitoring = require("../../models/DengueSchema");
const ClassEnrollment = require("../../models/ClassEnrollment");
const StudentProfile = require("../../models/StudentProfileSchema");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const exportDengueMonitoringData = require("../../custom/exportDengue.js");
const importDengueRecords = require("../../custom/importDengue.js");
const multer = require("multer");
const ExcelJS = require("exceljs");
const { createLog } = require("../recordLogRouter.js");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new dengue monitoring record
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { lrn, ...dengueData } = req.body;

    const student = await StudentProfile.findOne({ lrn: lrn }).exec();

    if (!student) {
      return res
        .status(400)
        .json({ error: "Invalid LRN or the student is not enrolled" });
    }

    const classEnrollment = await ClassEnrollment.findOne({
      student: student._id,
    }).exec();

    if (!classEnrollment) {
      return res
        .status(400)
        .json({ error: "Student is not enrolled in any class" });
    }

    const newDengueRecord = new DengueMonitoring({
      ...dengueData,
      classEnrollment: classEnrollment._id,
    });

    await newDengueRecord.save();
    await createLog('Dengue', 'CREATE', `${newDengueRecord}`, req.userData.userId);
    // Populate the Dengue record with ClassEnrollment and further details
    const populatedDengueRecord = await DengueMonitoring.findById(
      newDengueRecord._id
    )
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

    res.status(201).json({ newDengueRecord: populatedDengueRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch all dengue monitoring records
router.get("/fetch/:status", authenticateMiddleware, async (req, res) => {
  const { status } = req.params;

  if (!["Active", "Archived", "Inactive"].includes(status)) {
    return res.status(400).json({ error: "Invalid student status." });
  }

  try {
    const records = await DengueMonitoring.find({
      status: status,
    })
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

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all dengue monitoring records
router.get("/fetch", authenticateMiddleware, async (req, res) => {
  
  try {
    const records = await DengueMonitoring.find()
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

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a dengue monitoring record by LRN
router.put("/update/:lrn", authenticateMiddleware, async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ lrn: req.params.lrn });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Step 2: Find the ClassEnrollment using student's _id
    const classEnrollment = await ClassEnrollment.findOne({
      student: student._id,
    });

    if (!classEnrollment) {
      return res.status(404).json({
        error: "ClassEnrollment not found or the student is not enrolled",
      });
    }

    // Find existing Dengue monitoring record for the student
    const existingRecord = await DengueMonitoring.findOne({
      classEnrollment: classEnrollment._id,
    });

    if (!existingRecord)
      return res
        .status(404)
        .json({ error: "Dengue monitoring record not found" });

    // Merge the existing data with the update
    const updatedData = { ...existingRecord.toObject(), ...req.body };

    // Update the Dengue monitoring record
    const updatedDengueRecord = await DengueMonitoring.findOneAndUpdate(
      { classEnrollment: classEnrollment._id },
      updatedData,
      { new: true }
    ).populate({
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

    res.status(200).json(updatedDengueRecord);
    await createLog('Dengue', 'UPDATE', `${updatedDengueRecord}`, req.userData.userId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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

// Delete a dengue monitoring record by ID
router.put("/delete/:recordId", authenticateMiddleware, async (req, res) => {
  try {
    const dengueRecord = await DengueMonitoring.findById(req.params.recordId);

    if (!dengueRecord) {
      return res
        .status(404)
        .json({ error: "Dengue monitoring record not found" });
    }

    // Check if the Dengue monitoring record is already inactive
    if (dengueRecord.status === "Inactive") {
      return res.status(400).json({ error: "Record already inactive" });
    }

    dengueRecord.status = "Inactive";
    await dengueRecord.save();
    res.status(200).json({
      message: "Dengue monitoring record marked as Inactive",
      dengueRecord,
    });
    await createLog('Dengue', 'DELETE', `${dengueRecord}`, req.userData.userId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/archive/:recordId", authenticateMiddleware, async (req, res) => {
  try {
    const dengueRecord = await DengueMonitoring.findById(req.params.recordId);

    if (!dengueRecord) {
      return res
        .status(404)
        .json({ error: "Dengue monitoring record not found" });
    }

    // Check if the Dengue monitoring record is already archived
    if (dengueRecord.status === "Archived") {
      return res.status(400).json({ error: "Record already archived" });
    }

    dengueRecord.status = "Archived";
    await dengueRecord.save();
    res.status(200).json({
      message: "Dengue monitoring record marked as Archived",
      dengueRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/reinstate/:recordId", authenticateMiddleware, async (req, res) => {
  try {
    const dengueRecord = await DengueMonitoring.findById(req.params.recordId);

    if (!dengueRecord) {
      return res
        .status(404)
        .json({ error: "Dengue monitoring record not found" });
    }

    // Check if the Dengue monitoring record is already active
    if (dengueRecord.status === "Active") {
      return res.status(400).json({ error: "Record is already active" });
    }

    dengueRecord.status = "Active";
    await dengueRecord.save();
    res.status(200).json({
      message: "Dengue monitoring record reinstated to Active",
      dengueRecord,
    });
    await createLog('Dengue', 'UPDATE', `${dengueRecord}`, req.userData.userId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/export/:status?", async (req, res) => {
  const { status } = req.params;
  try {
    const buffer = await exportDengueMonitoringData(status);

    // Set the headers to prompt a download with a proper file name.
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=dengue-monitoring-report.xlsx"
    );

    // Send the buffer.
    res.send(buffer);
  } catch (error) {
    // Error handling
    console.error("Failed to export Dengue Monitoring data:", error);
    res.status(500).send("Error when trying to export data");
  }
});

router.post(
  "/import-dengue",
  authenticateMiddleware,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      const { dengueRecords, errors, hasMoreErrors } =
        await importDengueRecords(req.file.buffer);

      if (!workbook || !worksheet) {
        return res.status(400).json({ message: "Invalid Excel file format" });
      }

      const convertStringToDate = (dateString) => {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day); // months are 0-indexed in JS
      };

      for (const row of worksheet.getRows(2, worksheet.rowCount - 1)) {
        const rowData = {};

        headers.forEach((header, colIndex) => {
          const cellValue = row.getCell(colIndex + 1).text;

          if (
            [
              "Date of Onset",
              "Date of Admission",
              "Date of Discharge",
            ].includes(header)
          ) {
            rowData[header] = convertStringToDate(cellValue);
          } else {
            rowData[header] = cellValue;
          }
        });

        const { error } = validationSchema.validate(rowData);
        if (error) {
          errors.push(
            `Validation error for LRN ${rowData.LRN}: ${error.details[0].message}`
          );
          continue;
        }

        const studentProfile = await StudentProfile.findOne({
          lrn: rowData.LRN,
        });

        if (!studentProfile) {
          errors.push(`Invalid LRN found: ${rowData.LRN}`);
          invalidLRNs.push(rowData.LRN);
          continue;
        }

        const classEnrollment = await ClassEnrollment.findOne({
          student: studentProfile._id,
        });

        if (!classEnrollment) {
          errors.push(
            `ClassEnrollment not found or the student is not enrolled: ${rowData.LRN}`
          );
          invalidLRNs.push(rowData.LRN);
          continue;
        }

        const newDengueRecord = new DengueMonitoring({
          dateOfOnset: rowData["Date of Onset"],
          dateOfAdmission: rowData["Date of Admission"],
          hospitalAdmission: rowData["Hospital Admission"],
          dateOfDischarge: rowData["Date of Discharge"],
          classEnrollment: classEnrollment._id,
        });
        await createLog('Dengue', 'CREATE', `${newDengueRecord}`, req.userData.userId);
        dengueRecords.push(newDengueRecord);
      }

      if (errors.length > 0 && dengueRecords.length > 0) {
        await DengueMonitoring.insertMany(dengueRecords);
        return res
          .status(207)
          .json({ message: "Partial data import", errors, invalidLRNs });
      } else if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Data import failed", errors, invalidLRNs });
      } else {
        await DengueMonitoring.insertMany(dengueRecords);
        return res.status(201).json({
          message: "Import successful",
          dengueRecordsCount: dengueRecords.length,
          errors,
          hasMoreErrors,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
