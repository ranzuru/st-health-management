const express = require("express");
const MedicineItem = require("../../models/medicineItem.js");
const MedicineIn = require("../../models/medicineIn.js");
const StudentSchema = require("../../models/StudentProfileSchema.js");
const FacultySchema = require("../../models/FacultyProfileSchema.js");
const ClinicVisitSchema = require("../../models/clinicVisit.js");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const router = express.Router();
const { createLog } = require("../recordLogRouter.js");

// Middleware to authenticate routes if needed
router.use(authenticateMiddleware);

// Create a new document
router.post("/post", authenticateMiddleware, async (req, res) => {
  try {
    const { patient_id, patient_name, patient_age, patient_type, dosage, quantity, frequency, duration, reason, issueDate, medicine_id, pcp_id } = req.body;

    let patientIdValidation;
    if (patient_type === "Student") {
        patientIdValidation = await StudentSchema.findOne({ lrn: patient_id });
        if (!patientIdValidation) {
          return res.status(404).json({ error: "Student not found" });
        }
    } else if (patient_type === "Faculty") {
        patientIdValidation = await FacultySchema.findOne({ employeeId: patient_id });
        if (!patientIdValidation) {
          return res.status(404).json({ error: "Faculty not found" });
        }
    } else if (patient_type === "Other") {
    
    } else {
        return res.status(404).json({ error: "Invalid Patient Type" });
    }

    const medicineValidation = await MedicineIn.findById(medicine_id);
    if (!medicineValidation) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    const pcpIdValidation = await FacultySchema.findOne({ employeeId: pcp_id });
    if (!pcpIdValidation) {
      return res.status(404).json({ error: "PCP not found" });
    }

    if (patient_type === "Other") {
      if (!patient_name || !patient_age || !patient_type || !dosage  || !quantity || !frequency || !duration || !reason || !issueDate || !medicine_id || !pcp_id) {
        console.log("Missing required fields");
        return res.status(400).json({
          error:
            "Missing required fields: patient_name, patient_type, dosage, quantity, frequency, duration, reason, issueDate, medicine_id, pcp_id",
        });
      }
    } else {
      if (!patient_id || !patient_age || !patient_type || !dosage  || !quantity || !frequency || !duration || !reason || !issueDate || !medicine_id || !pcp_id) {
        console.log("Missing required fields");
        return res.status(400).json({
          error:
            "Missing required fields: patient_id, patient_type, dosage, quantity, frequency, duration, reason, issueDate, medicine_id, pcp_id",
        });
      }
    }
   
    // Create a new document
    let document;

    if (patient_type !== "Other") {
      document = new ClinicVisitSchema({ patient_id, patient_age, patient_type, dosage, quantity, frequency, duration, reason, issueDate, medicine_id, pcp_id });
    } else {
      document = new ClinicVisitSchema({ patient_name, patient_age, patient_type, dosage, quantity, frequency, duration, reason, issueDate, medicine_id, pcp_id });
    }
    
    // Save the document to the database
    await document.save();
    // LOG DATA AFTER SUCCESSFUL PROCESS
    await createLog('Clinic Visit', 'CREATE', `${document}`, req.userData.userId);
    res.status(201).json(document);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

// Get all documents
router.get("/get", authenticateMiddleware, async (req, res) => {
  try {
    const documents = await ClinicVisitSchema.find();

    // Manually populate student_data using LRN
    const populatedDocuments = await Promise.all(
      documents.map(async (doc) => {

        let patientIdData;
        if (doc.patient_type === "Student") {
            // Fetch student data using LRN
            patientIdData = await StudentSchema.findOne({ lrn: doc.patient_id }).select("_id lrn lastName firstName middleName nameExtension gender");
        } else if (doc.patient_type === "Faculty") {
            // Fetch adviser data based on role "Adviser"
            patientIdData = await FacultySchema.findOne({ employeeId: doc.patient_id }).select("_id employeeId firstName lastName");
        }

        const pcpIdData = await FacultySchema.findOne({ employeeId: doc.pcp_id }).select("_id employeeId firstName lastName");

        const medicineInData = await MedicineIn.findById( doc.medicine_id ).select("_id itemId batchId expirationDate quantity");
        const MedicineItemData = await MedicineItem.findById( medicineInData.itemId ).select("_id product ");

        return {
          ...doc.toObject(),
          patient_id: patientIdData || null,
          medicine_id: medicineInData || null,
          pcp_id: pcpIdData || null,
          MedicineItemData: MedicineItemData || null,
        };
      })
    );
    res.json(populatedDocuments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a specific document by ID
router.put(
  "/put/:id",
  authenticateMiddleware,
  async (req, res) => {
    try {
      const { patient_id, patient_name, patient_age, patient_type, dosage, quantity, frequency, duration, reason, issueDate, medicine_id, pcp_id } = req.body;

      const document = await ClinicVisitSchema.findByIdAndUpdate(
        req.params.id,
        {
          patient_id, patient_name, patient_age, patient_type, dosage, quantity, frequency, duration, reason, issueDate, medicine_id, pcp_id,
        },
        { new: true }
      );

      if (!document) {
        return res.status(404).json({ error: "Record not found" });
      }
      // LOG DATA AFTER SUCCESSFUL PROCESS
      await createLog('Clinic Visit', 'UPDATE', `${document}`, req.userData.userId);
      res.json(document);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;