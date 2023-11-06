const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      default: null,
    },
    patient_name: {
      type: String,
      default: null,
    },
    patient_age: {
      type: Number,
      required: true,
    },
    patient_type: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    medicine_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "medicineIn",
      required: true,
    },
    pcp_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ClinicVisitSchema = mongoose.model("clinicVisit", schema);

module.exports = ClinicVisitSchema