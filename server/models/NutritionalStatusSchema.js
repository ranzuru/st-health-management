const mongoose = require("mongoose");

const nutritionalStatusSchema = new mongoose.Schema(
  {
    dateMeasured: {
      type: Date,
      required: true,
    },
    studentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    weightKg: {
      type: Number,
      required: true,
    },
    heightCm: {
      type: Number,
      required: true,
    },
    BMI: {
      type: Number,
      required: true,
    },
    BMIClassification: {
      type: String,
      required: true,
    },
    heightForAge: {
      type: String,
      required: true,
    },
    beneficiaryOfSBFP: {
      type: Boolean,
      required: true,
    },
    measurementType: {
      type: String,
      enum: ["PRE", "POST"],
      required: true,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

nutritionalStatusSchema.index(
  { studentProfile: 1, measurementType: 1 },
  { unique: true }
);
const NutritionalStatus = mongoose.model(
  "NutritionalStatus",
  nutritionalStatusSchema
);

module.exports = NutritionalStatus;
