const mongoose = require("mongoose");

const FacultyCheckupSchema = new mongoose.Schema(
  {
    dateOfExamination: { type: Date, required: true },
    facultyProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyProfile",
      required: true,
    },
    weightKg: { type: Number, default: null },
    heightCm: { type: Number, default: null },
    temperature: { type: Number, default: null },
    bloodPressure: { type: String, default: null },
    heartRate: { type: Number, default: null },
    pulseRate: { type: Number, default: null },
    respiratoryRate: { type: Number, default: null },
    visionScreeningLeft: { type: String, default: null },
    visionScreeningRight: { type: String, default: null },
    auditoryScreeningLeft: { type: String, default: null },
    auditoryScreeningRight: { type: String, default: null },
    skinScreening: { type: String, default: null },
    scalpScreening: { type: String, default: null },
    eyesScreening: { type: String, default: null },
    earScreening: { type: String, default: null },
    noseScreening: { type: String, default: null },
    mouthScreening: { type: String, default: null },
    throatScreening: { type: String, default: null },
    neckScreening: { type: String, default: null },
    lungScreening: { type: String, default: null },
    heartScreening: { type: String, default: null },
    abdomen: { type: String, default: null },
    deformities: { type: String, default: null },
    ironSupplementation: { type: Boolean, default: false },
    deworming: { type: Boolean, default: false },
    sbfpBeneficiary: { type: Boolean, default: false },
    menarche: { type: String, default: null },
  },
  { timestamps: true }
);

// Create a model for medical checkup using the schema
const FacultyCheckup = mongoose.model("FacultyCheckup", FacultyCheckupSchema);

module.exports = FacultyCheckup;
