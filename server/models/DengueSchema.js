const mongoose = require("mongoose");

const dengueSchema = new mongoose.Schema(
  {
    studentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    dateOfOnset: { type: Date, required: true },
    dateOfAdmission: { type: Date, required: true },
    hospitalAdmission: { type: String, required: true },
    dateOfDischarge: { type: Date, required: true },
  },
  { timestamps: true }
);
const DengueMonitoring = mongoose.model("DengueMonitoring", dengueSchema);

module.exports = DengueMonitoring;
