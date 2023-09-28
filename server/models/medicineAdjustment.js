const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  batchId: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    default: "",
  },
}, { timestamps: true });

const MedicineAdjustment = mongoose.model("medicine_adjustment", medicineSchema);

module.exports = MedicineAdjustment;
