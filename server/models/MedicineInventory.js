const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  numericStockLevel: {
    type: Number, // Store the numeric stock level
    required: true,
  },
  stockLevel: {
    type: String, // Store the descriptive stock level
    enum: ["High", "Moderate", "Low"],
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  lastRestockDate: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
  },
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
