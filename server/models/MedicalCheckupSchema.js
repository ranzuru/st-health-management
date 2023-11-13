const mongoose = require("mongoose");

const medicalCheckupSchema = new mongoose.Schema(
  {
    dateOfExamination: { type: Date, required: true },
    classEnrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassEnrollment",
      required: true,
    },
    nutritionalStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NutritionalStatus",
    },
    temperature: { type: Number, required: true },
    bloodPressure: { type: String, required: true },
    heartRate: { type: Number, required: true },
    pulseRate: { type: Number, required: true },
    respiratoryRate: { type: Number, required: true },
    visionScreeningLeft: { type: String, required: true },
    visionScreeningRight: { type: String, required: true },
    auditoryScreeningLeft: { type: String, required: true },
    auditoryScreeningRight: { type: String, required: true },
    
    skinScreening: { type: String, required: true },
    scalpScreening: { type: String, required: true },
    eyesScreening: { type: String, required: true },
    earScreening: { type: String, required: true },
    noseScreening: { type: String, required: true },
    mouthScreening: { type: String, required: true },
    throatScreening: { type: String, required: true },
    neckScreening: { type: String, required: true },
    lungScreening: { type: String, required: true },
    heartScreening: { type: String, required: true },
    abdomen: { type: String, required: true },
    deformities: { type: String, required: true },
    ironSupplementation: { type: Boolean, required: true },
    deworming: { type: Boolean, required: true },
    menarche: { type: String },
    status: {
      type: String,
      enum: ["Active", "Archived", "Inactive"],
      default: "Active",
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

medicalCheckupSchema.index({ classEnrollment: 1 }, { unique: true });
const MedicalCheckup = mongoose.model("MedicalCheckup", medicalCheckupSchema);

module.exports = MedicalCheckup;
