const express = require("express");
const Schema = require("../../models/dengue.js");
const StudentSchema = require("../../models/Student.js");
const ClassSchema = require("../../models/ClassProfileSchema.js");
const AdviserSchema = require("../../models/FacultyProfileSchema.js");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticateMiddleware);

// Create a new document
router.post("/post", async (req, res) => {
  try {
    const { onsetDate, admissionDate, admissionHospital, dischargeDate, adviser_data, student_data, student_age, class_data } = req.body;

    const lrnValidation = await StudentSchema.findOne({
      student_class: class_data,
    });
    if (!lrnValidation) {
      return res.status(404).json({ error: "student lrn does not exist in this class" });
    }
    const classDataValidation = await ClassSchema.findById(class_data);
    if (!classDataValidation) {
      return res.status(404).json({ error: "Class not found" });
    }
    const adviserDataValidation = await AdviserSchema.findById(adviser_data);
    if (!adviserDataValidation) {
      return res.status(404).json({ error: "Adviser not found" });
    }

    if (!onsetDate || !student_age || !class_data || !adviser_data || !student_data) {
      console.log("Missing required fields");
      return res.status(400).json({
        error:
          "Missing required fields: onsetDate, adviser_data, student_data, class_data",
      });
    }

    // Create a new document
    const document = new Schema({ onsetDate, admissionDate, admissionHospital, dischargeDate, adviser_data: adviserDataValidation._id, student_data, student_age, class_data: classDataValidation._id });

    // Save the document to the database
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

// Get all documents
router.get("/get", async (req, res) => {
  try {
    const documents = await Schema.find();

    // Manually populate student_data using LRN
    const populatedDocuments = await Promise.all(
      documents.map(async (doc) => {
        // Fetch student data using LRN
        const studentData = await StudentSchema.findOne({ lrn: doc.student_data }).select("lrn lastName firstName middleName nameExtension address");

        // Fetch class data
        const classData = await ClassSchema.findById(doc.class_data).select("_id grade section syFrom syTo");

        // Fetch adviser data based on role "Adviser"
        const adviserData = await AdviserSchema.findOne({ _id: doc.adviser_data, role: "Adviser" }).select("_id firstName lastName");

        return {
          ...doc.toObject(),
          student_data: studentData || null,
          class_data: classData || null,
          adviser_data: adviserData || null,
        };
      })
    );

    res.json(populatedDocuments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific document by ID
router.get("/get/:id", async (req, res) => {
  try {
    const document = await Schema.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const populatedDocuments = await Promise.all(
      document.map(async (doc) => {
        // Fetch student data using LRN
        const studentData = await StudentSchema.findOne({ lrn: doc.student_data }).select("lrn lastName firstName middleName nameExtension address");

        // Fetch class data
        const classData = await ClassSchema.findById(doc.class_data).select("_id grade section syFrom syTo");

        // Fetch adviser data based on role "Adviser"
        const adviserData = await AdviserSchema.findOne({ _id: doc.adviser_data, role: "Adviser" }).select("_id firstName lastName");

        return {
          ...doc.toObject(),
          student_data: studentData || null,
          class_data: classData || null,
          adviser_data: adviserData || null,
        };
      })
    );

    res.json(populatedDocuments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a specific document by ID
router.put("/put/:id", async (req, res) => {
  try {
    const updatedDocumentData = {
      ...req.body,
    };

    const updatedDocument = await Schema.findByIdAndUpdate(
      req.params.id,
      updatedDocumentData,
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ error: "Student profile not found" });
    }
    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a specific document by ID
// router.delete("/deleteMedicine/:id", async (req, res) => {
//   try {
//     const deletedMedicine = await Schema.findByIdAndRemove(req.params.id);
//     if (!deletedMedicine) {
//       return res.status(404).json({ error: "Medicine not found" });
//     }
//     res.json({ message: "Medicine deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
