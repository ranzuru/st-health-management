const express = require("express");
const MedicineItem = require("../../models/medicineItem.js");
const MedicineIn = require("../../models/medicineIn.js");
const MedicineDisposal = require("../../models/medicineDisposal.js");
const MedicineAdjustment = require("../../models/medicineAdjustment.js");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const router = express.Router();
const { createLog } = require("../recordLogRouter.js");

// Middleware to authenticate routes if needed
router.use(authenticateMiddleware);

// ================================================================= MEDICINE ITEM
// Create Single
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

    const document = new MedicineItem({ product, overallQuantity, quantityLevel, description });

    await document.save();
    // LOG DATA AFTER SUCCESSFUL PROCESS
    await createLog('Medicine Inventory - Item', 'CREATE', `${document}`, req.userData.userId);
    res.status(201).json(document);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});
// Retrieve All
router.get("/getItem", async (req, res) => {
  try {
    const document = await MedicineItem.find();
    if (!document) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Retrieve Specific
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
// Update Specific
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
    // LOG DATA AFTER SUCCESSFUL PROCESS
    await createLog('Medicine Inventory - Item', 'UPDATE', `${document}`, req.userData.userId);
    res.json({document});
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// ================================================================= MEDICINE IN
// Create Single
router.post("/postIn", async (req, res) => {
  try {
    const { itemId, batchId, receiptId, quantity, expirationDate, note } = req.body;

    if (!itemId || !batchId || !receiptId || !quantity || !expirationDate) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Missing required fields: itemId, batchId, receiptId, quantity, expirationDate, note",});
    }

    const existingBatchId = await MedicineIn.findOne({batchId: batchId});
    const existingItemId = await MedicineItem.findOne({_id: itemId});

    if (!existingItemId) {
      return res.status(404).json({ error: "Operation Failed: Item ID does not exists" });
    } else {
      if (existingBatchId) {
        return res.status(404).json({ error: "Operation Failed: Batch ID already exists" });
      } else {
        const document = new MedicineIn({ itemId, batchId, receiptId, quantity, expirationDate, note });
  
        await document.save();
        // LOG DATA AFTER SUCCESSFUL PROCESS
        await createLog('Medicine Inventory - In', 'CREATE', `${document}`, req.userData.userId);
        return res.status(201).json(document);
      }  
    }  
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});
// Retrieve All
router.get("/getIn", async (req, res) => {
  try {
    const document = await MedicineIn.find();
    if (!document) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Retrieve Specific
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
// Retrieve Specific Batch ID
router.get("/getInBatchId/:batchId", async (req, res) => {
  try {
    const batchId = req.params.batchId;
    const document = await MedicineIn.findOne({batchId});
    if (!document) {
      return res.json({ document });
    }
    res.json( document );  
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// ================================================================= MEDICINE DISPOSAL
// Create Single
router.post("/postDisposal", async (req, res) => {
  try {
    const { itemId, batchId, quantity, reason} = req.body;

    if (!itemId || !batchId || !quantity || !reason ) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Missing required fields: itemId, batchId, quantity, reason",});
    }

    const document = new MedicineDisposal({ itemId, batchId, quantity, reason });

    await document.save();
    // LOG DATA AFTER SUCCESSFUL PROCESS
    await createLog('Medicine Inventory - Disposal', 'CREATE', `${document}`, req.userData.userId);
    res.status(201).json(document);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});
// Retrieve All
router.get("/getDisposal", async (req, res) => {
  try {
    const document = await MedicineDisposal.find();
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Retrieve Specific
router.get("/getDisposal/:id", async (req, res) => {
  try {
    const document = await MedicineDisposal.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Record not found" });
    }
    // LOG DATA AFTER SUCCESSFUL PROCESS
    await createLog('Medicine Inventory - Disposal', 'CREATE', `${document}`, req.userData.userId);
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Retrieve Specific Batch ID
router.get("/getDisposalBatchId/:batchId", async (req, res) => {
  try {
    const batchId = req.params.batchId;
    const documents = await MedicineDisposal.find({ batchId });
    
    if (!documents || documents.length === 0) {
      return res.json({ message: "No record found." });
    }
    
    let disposalTotal = 0;

    for (const document of documents) {
      disposalTotal += document.quantity;
    }
    
    res.json({ disposalTotal, documents });  
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Retrieve Specific Item ID
router.get("/getDisposalItemId/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const documents = await MedicineDisposal.find({ itemId });
    
    if (!documents || documents.length === 0) {
      return res.json({ message: "No record found." });
    }
    
    let disposalTotal = 0;

    disposalTotal += documents.quantity;
    res.json({ disposalTotal, documents });  
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// ================================================================= MEDICINE ADJUSTMENT
// Create Single
router.post("/postAdjustment", async (req, res) => {
  try {
    const { itemId, batchId, quantity, type, reason } = req.body;

    if (!itemId || !batchId  || !quantity || !type || !reason) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Missing required fields: itemId, batchId, quantity, type, reason",});
    }

    const existingBatchId = await MedicineIn.findOne({batchId: batchId});

    if (!existingBatchId) {
      return res.status(404).json({ error: "Operation Failed: Batch ID does not exists" });
    } else {
      const document = new MedicineAdjustment({ itemId, batchId, quantity, type, reason });
    await document.save();
    // LOG DATA AFTER SUCCESSFUL PROCESS
    await createLog('Medicine Inventory - Adjustment', 'CREATE', `${document}`, req.userData.userId);
    res.status(201).json(document);
    } 
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});
// Retrieve All
router.get("/getAdjustment", async (req, res) => {
  try {
    const document = await MedicineAdjustment.find();
    if (!document) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Retrieve Specific
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
// Retrieve Specific Batch ID
router.get("/getAdjustmentBatchId/:batchId", async (req, res) => {
  try {
    const batchId = req.params.batchId;
    const documents = await MedicineAdjustment.find({ batchId });
    
    if (!documents || documents.length === 0) {
      return res.json({ message: "No record found." });
    }
    
    let additionTotal = 0;
    let subtractionTotal = 0;

    // Iterate through the retrieved documents and calculate totals based on type
    for (const document of documents) {
      if (document.type === 'Addition') {
        additionTotal += document.quantity;
      } else if (document.type === 'Subtraction') {
        subtractionTotal += document.quantity;
      }
    }
    res.json({ additionTotal, subtractionTotal, documents });  
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// ================================================================= CUSTOMIZED (MIXED)
// Retrieve Specific by expiration date (In) and its total quantity (Batch)
router.get("/getBatchTotalWithExpiration", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const medicineInData = await MedicineIn.find().select("_id itemId batchId expirationDate quantity");
    const populatedDocuments = await Promise.all(
      medicineInData.map(async (doc) => {
        // Fetch student data using LRN
        const MedicineItemData = await MedicineItem.findById( doc.itemId ).select("_id product ");
        const MedicineDisposalData = await MedicineDisposal.find( {batchId: doc.batchId} ).select("_id quantity ");
        const MedicineAdjustmentData = await MedicineAdjustment.find( {batchId: doc.batchId} ).select("_id quantity type");
        
        const inQty = doc.quantity;
        let dispTotal = 0;
        let addAdjTotal = 0;
        let subAdjTotal = 0;

        // Accumulate the quantity from multiple MedicineDisposalData results
        for (const disposalData of MedicineDisposalData) {
          dispTotal += disposalData.quantity;
        }

        // Accumulate the quantity based on type from multiple MedicineAdjustmentData results
        for (const adjustmentData of MedicineAdjustmentData) {
          if (adjustmentData.type === 'Addition') {
            addAdjTotal += adjustmentData.quantity;
          } else if (adjustmentData.type === 'Subtraction') {
            subAdjTotal += adjustmentData.quantity;
          }
        }
        
        const presentBatchQty = Math.abs((inQty + addAdjTotal - subAdjTotal) - dispTotal);

        return {
          ...doc.toObject(),
          MedicineItemData: MedicineItemData || null,
          presentBatchQty: presentBatchQty || null,
        };
      })
    );
    const filteredDocuments = populatedDocuments.filter((doc) => {
      return doc.presentBatchQty !== 0 && new Date(doc.expirationDate) > today;
    });

    res.json(filteredDocuments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;