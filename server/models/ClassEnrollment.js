const mongoose = require("mongoose");

const classEnrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    classProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassProfile",
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Archived", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);
classEnrollmentSchema.index({ student: 1, academicYear: 1 }, { unique: true });
module.exports = mongoose.model("ClassEnrollment", classEnrollmentSchema);
