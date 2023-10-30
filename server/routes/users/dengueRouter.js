const express = require("express");
const DengueMonitoring = require("../../models/DengueSchema");
const StudentProfile = require("../../models/StudentProfileSchema");
const router = express.Router();
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const multer = require("multer");
const ExcelJS = require("exceljs");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Joi = require("joi");

const validationSchema = Joi.object({
  LRN: Joi.string().required("LRN is required."),
  "Date of Onset": Joi.date().required("Date of Onset is required."),
  "Date of Admission": Joi.date().required("Date of Admission is required."),
  "Hospital Admission": Joi.string().required(
    "Hospital Admission is required."
  ),
  "Date of Discharge": Joi.date().required("Date of Discharge is required."),
});

// Create a new dengue monitoring record
router.post("/create", authenticateMiddleware, async (req, res) => {
  try {
    const { lrn, ...dengueData } = req.body;
    const student = await StudentProfile.findOne({ lrn });

    if (!student) return res.status(400).json({ error: "Invalid LRN" });

    const newDengueRecord = new DengueMonitoring({
      ...dengueData,
      studentProfile: student._id,
    });

    await newDengueRecord.save();

    const populatedDengueRecord = await DengueMonitoring.findById(
      newDengueRecord._id
    )
      .populate({
        path: "studentProfile",
        populate: {
          path: "classProfile",
        },
      })
      .exec();

    res.status(201).json({ newDengueRecord: populatedDengueRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch all dengue monitoring records
router.get("/fetch", authenticateMiddleware, async (req, res) => {
  try {
    const records = await DengueMonitoring.find()
      .populate({
        path: "studentProfile",
        populate: { path: "classProfile" },
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
    const studentProfile = await StudentProfile.findOne({
      lrn: req.params.lrn,
    });
    if (!studentProfile)
      return res.status(404).json({ error: "StudentProfile not found" });

    const existingRecord = await DengueMonitoring.findOne({
      studentProfile: studentProfile._id,
    });
    if (!existingRecord)
      return res
        .status(404)
        .json({ error: "Dengue monitoring record not found" });

    const updatedData = { ...existingRecord.toObject(), ...req.body };

    const updatedDengueRecord = await DengueMonitoring.findOneAndUpdate(
      { studentProfile: studentProfile._id },
      updatedData,
      { new: true }
    ).populate({
      path: "studentProfile",
      populate: { path: "classProfile" },
    });

    res.status(200).json(updatedDengueRecord);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/search/:partialLrn", authenticateMiddleware, async (req, res) => {
  try {
    const partialLrn = req.params.partialLrn;
    const students = await StudentProfile.find({
      lrn: new RegExp(partialLrn, "i"),
      status: "Enrolled",
    })
      .populate("classProfile", "grade section academicYear -_id") // Populating grade and section from ClassProfile
      .select(
        "lrn lastName firstName middleName nameExtension gender age birthDate address classProfile -_id"
      );

    if (!students || students.length === 0)
      return res.status(404).json({ error: "No matches found" });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a dengue monitoring record by ID
router.delete("/delete/:id", authenticateMiddleware, async (req, res) => {
  try {
    const record = await DengueMonitoring.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/import-excel",
  authenticateMiddleware,
  upload.single("file"),
  async (req, res) => {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const workbook = new ExcelJS.Workbook();
    const headers = [
      "LRN",
      "Date of Onset",
      "Date of Admission",
      "Hospital Admission",
      "Date of Discharge",
    ];

    const dengueRecords = [];
    const errors = [];
    const invalidLRNs = [];

    try {
      await workbook.xlsx.load(fileBuffer);
      const worksheet = workbook.getWorksheet(1);

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

        const student = await StudentProfile.findOne({ lrn: rowData.LRN });
        if (!student) {
          errors.push(`Invalid LRN found: ${rowData.LRN}`);
          invalidLRNs.push(rowData.LRN);
          continue;
        }

        const newDengueRecord = new DengueMonitoring({
          dateOfOnset: rowData["Date of Onset"],
          dateOfAdmission: rowData["Date of Admission"],
          hospitalAdmission: rowData["Hospital Admission"],
          dateOfDischarge: rowData["Date of Discharge"],
          studentProfile: student._id,
        });

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
        return res.json({ message: "Data imported successfully" });
      }
    } catch (error) {
      console.error("Error while importing Excel:", error.message);
      res.status(500).json({ message: "Failed to import data" });
    }
  }
);

module.exports = router;
