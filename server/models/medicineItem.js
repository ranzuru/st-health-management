const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  overallQuantity: {
    type: Number,
    default: 0,
    required: true,
  },
  quantityLevel: {
    type: String,
    enum: ["High", "Moderate", "Low"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const MedicineItem = mongoose.model("medicineItem", medicineSchema);

module.exports = MedicineItem;