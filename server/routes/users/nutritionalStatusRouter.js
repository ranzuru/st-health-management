const express = require("express");
const Schema = require("../../models/nutritionalStatus.js");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticateMiddleware);

// Create a new document
router.post("/post", async (req, res) => {
  try {
    const { weight, height, height2, bmi, bmiCategory, hfa, remarks, type } = req.body;

    if (!weight || !height || !height2 || !bmi || !bmiCategory || !hfa || !remarks || !type) {
      console.log("Missing required fields");
      return res.status(400).json({
        error:
          "Missing required fields: weight, height, height2, bmi, bmiCategory, hfa, remarks, type",
      });
    }


    // Create a new document
    const document = new Schema({ weight, height, height2, bmi, bmiCategory, hfa, remarks, type });

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
    const document = await Schema.find();
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific document by ID
router.get("/get/:id", async (req, res) => {
  try {
    const document = await Schema.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(document);
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
      return res.status(404).json({ error: "Record not found" });
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
//       return res.status(404).json({ error: "Record not found" });
//     }
//     res.json({ message: "Data deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
