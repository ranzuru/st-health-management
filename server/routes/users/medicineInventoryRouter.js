const express = require("express");
const MedicineItem = require("../../models/medicineItem.js");
const MedicineIn = require("../../models/medicineIn.js");
const MedicineDisposal = require("../../models/medicineDisposal.js");
const MedicineAdjustment = require("../../models/medicineAdjustment.js");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticateMiddleware);

// Create a medicine item
router.post("/postItem", async (req, res) => {
  try {
    const { product, overallQuantity, description } = req.body;

    if (!product || !description ) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Missing required fields: product, description",});
    }

    let quantityLevel = "Low";
    if (overallQuantity > 50) {
        quantityLevel = "High";
    } else if (overallQuantity > 20) {
        quantityLevel = "Moderate";
    }

    // Create a new medicine document
    const document = new MedicineItem({ product, overallQuantity, quantityLevel, description });

    // Save the medicine document to the database
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});
// Create a stock in record
router.post("/postIn", async (req, res) => {
    try {
      const { itemId, batchId, quantity, expirationDate } = req.body;
  
      if (!itemId || !batchId || !quantity || !expirationDate) {
        console.log("Missing required fields");
        return res.status(400).json({ error: "Missing required fields: itemId, batchId, quantity, expirationDate",});
      }

      const document = new MedicineIn({ itemId, batchId, quantity, expirationDate });
  
      await document.save();
      res.status(201).json(document);
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error: " + error.message });
    }
});
// Create a stock disposal record
router.post("/postDisposal", async (req, res) => {
    try {
      const { itemId, batchId, quantity, } = req.body;
  
      if (!itemId || !batchId || !quantity ) {
        console.log("Missing required fields");
        return res.status(400).json({ error: "Missing required fields: itemId, batchId, quantity,",});
      }
  
      const document = new MedicineDisposal({ itemId, batchId, quantity, });
  
      await document.save();
      res.status(201).json(document);
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error: " + error.message });
    }
});
// Create a stock adjustment record
router.post("/postAdjustment", async (req, res) => {
    try {
      const { itemId, batchId, quantity, expirationDate, type, reason } = req.body;
  
      if (!itemId || !batchId  || !quantity || !expirationDate || !type || !reason) {
        console.log("Missing required fields");
        return res.status(400).json({ error: "Missing required fields: itemId, batchId, quantity, expirationDate, type, reason",});
      }
  
      // Create a new medicine document
      const document = new MedicineAdjustment({ itemId, batchId, quantity, expirationDate, type, reason });
  
      // Save the medicine document to the database
      await document.save();
      res.status(201).json(document);
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error: " + error.message });
    }
});
// =================================================================
// Get all medicine item
router.get("/getItem", async (req, res) => {
  try {
    const document = await MedicineItem.find();
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get all stock in record
router.get("/getIn", async (req, res) => {
    try {
      const document = await MedicineIn.find();
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
// Get all stock disposal record
router.get("/getDisposal", async (req, res) => {
    try {
      const document = await MedicineDisposal.find();
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
// Get all stock adjustment record
router.get("/getAdjustment", async (req, res) => {
    try {
      const document = await MedicineAdjustment.find();
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
// =================================================================
// Get a specific stock in record by ID
router.get("/getItem/:id", async (req, res) => {
  try {
    const document = await MedicineItem.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get a specific stock in record by ID
router.get("/getIn/:id", async (req, res) => {
  try {
    const document = await MedicineIn.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get a specific stock disposal record by ID
router.get("/getDisposal/:id", async (req, res) => {
    try {
      const document = await MedicineDisposal.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "Record not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
// Get a specific stock adjustment record by ID
router.get("/getAdjustment/:id", async (req, res) => {
    try {
      const document = await MedicineAdjustment.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "Record not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
// =================================================================
// Update a specific medicine item by ID
router.put("/putItem/:id", async (req, res) => {
  try {
    const { product, description } = req.body;

    const overallQuantity = parseInt(req.body.overallQuantity, 10);

    let quantityLevel = "Low";
    if (overallQuantity > 50) {
        quantityLevel = "High";
    } else if (overallQuantity > 20) {
        quantityLevel = "Moderate"; 
    }

    const document = await MedicineItem.findByIdAndUpdate( req.params.id, { 
      product, 
      overallQuantity, 
      quantityLevel, 
      description }, { new: true });

    if (!document) {
      return res.status(404).json({ error: "Medicine item not found" });
    }
    res.json({document});
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
