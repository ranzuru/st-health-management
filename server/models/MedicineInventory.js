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
  stockLevel: {
    type: String, // Store the descriptive stock level
    enum: ["High", "Moderate", "Low"],
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  restockDate: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    default: "None",
  },
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
