const express = require("express");
const Medicine = require("../../models/MedicineInventory.js");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticateMiddleware);

// Create a new medicine
router.post("/createMedicine", async (req, res) => {
  try {
    const { product, category, quantity, expirationDate, restockDate, note } =
      req.body;

    if (!product || !category || !quantity || !expirationDate || !restockDate) {
      console.log("Missing required fields");
      return res.status(400).json({
        error:
          "Missing required fields: product, category, quantity, expirationDate, restockDate",
      });
    }

    // Explicitly creating Date objects
    const expiration = new Date(expirationDate);
    const restock = new Date(restockDate);

    // Calculate stockLevel based on quantity
    let stockLevel = "Low";
    if (quantity > 50) {
      stockLevel = "High";
    } else if (quantity > 20) {
      stockLevel = "Moderate";
    }

    // Create a new medicine document
    const medicine = new Medicine({
      product,
      category,
      quantity,
      stockLevel,
      expirationDate: expiration,
      restockDate: restock,
      note,
    });

    // Save the medicine document to the database
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

// Get all medicines
router.get("/fetchMedicine", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific medicine by ID
router.get("/medicines/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a specific medicine by ID
router.put("/updateMedicine/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    let stockLevel = "Low";
    if (quantity > 50) {
      stockLevel = "High";
    } else if (quantity > 20) {
      stockLevel = "Moderate";
    }

    const updatedMedicineData = {
      ...req.body,
      stockLevel, // Overwrite stockLevel with newly calculated value
    };

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      updatedMedicineData,
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a specific medicine by ID
router.delete("/deleteMedicine/:id", async (req, res) => {
  try {
    const deletedMedicine = await Medicine.findByIdAndRemove(req.params.id);
    if (!deletedMedicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
