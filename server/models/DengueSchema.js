const mongoose = require("mongoose");

const dengueSchema = new mongoose.Schema(
  {
    classEnrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassEnrollment",
      required: true,
    },
    dateOfOnset: { type: Date },
    dateOfAdmission: { type: Date },
    hospitalAdmission: { type: String, required: true },
    dateOfDischarge: { type: Date },
    status: {
      type: String,
      enum: ["Active", "Archived", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);
const DengueMonitoring = mongoose.model("DengueMonitoring", dengueSchema);

module.exports = DengueMonitoring;
