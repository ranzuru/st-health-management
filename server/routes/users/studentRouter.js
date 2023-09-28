const express = require("express");
const StudentSchema = require("../../models/Student.js");
const ClassSchema = require("../../models/ClassProfileSchema.js");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticateMiddleware);

// Create a new document
router.post("/post", async (req, res) => {
  try {
    const { lrn, lastName, firstName, middleName, nameExtension, gender, birthDate, is4p, parentName1, parentMobile1, parentName2, parentMobile2, address, status, student_class } = req.body;

    // Check if the provided employeeId is valid
    const classProfile = await ClassSchema.findById(student_class);
    if (!classProfile) {
      return res.status(404).json({ error: "Class not found" });
    }

    if (!lrn || !lastName || !firstName || !middleName || !gender || !birthDate || !is4p || !parentName1 || !parentMobile1 || !address || !status || !student_class) {
      console.log("Missing required fields");
      return res.status(400).json({
        error:
          "Missing required fields: lrn, lastName, firstName, middleName, nameExtension, gender, birthDate, is4p, parentName1, parentMobile1, address, status, student_class",
      });
    }

    // Create a new document
    const document = new StudentSchema({ 
      lrn, lastName, firstName, middleName, nameExtension, gender, birthDate, is4p, parentName1, parentMobile1, parentName2, parentMobile2, address, status, 
      student_class: classProfile._id});

    // Save the document to the database
    await document.save();
    const populatedStudentSchema = await StudentSchema.findById(
      document._id
    ).populate("student_class");
    res.status(201).json({ document: populatedStudentSchema });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

// Get all documents
router.get("/get", async (req, res) => {
  try {
    const document = await StudentSchema.find().populate({
      path: "student_class",
      select: "_id grade section syFrom syTo",
      transform: (doc) => ({
        class_id: doc._id,
        class: `${doc.grade} - ${doc.section} (${doc.syFrom} - ${doc.syTo})`,
        schoolYear: `${doc.syFrom} - ${doc.syTo}`
      }),
    });
    
    res.json(document);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific document by ID
router.get("/get/:id", async (req, res) => {
  try {
    const document = await StudentSchema.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Student profile not found" });
    }
    res.json(document);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a specific document by ID
router.put("/put/:id", async (req, res) => {
  try {
    const updatedDocumentData = {
      ...req.body,
    };

    const updatedDocument = await StudentSchema.findByIdAndUpdate(
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
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const deleteDocument = await Schema.findByIdAndRemove(req.params.id);
//     if (!deleteDocument) {
//       return res.status(404).json({ error: "Data not found" });
//     }
//     res.json({ message: "Data deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
