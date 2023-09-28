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
  receiptId: {
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
  notes: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const MedicineDisposal = mongoose.model("medicine_disposal", medicineSchema);

module.exports = MedicineDisposal;
