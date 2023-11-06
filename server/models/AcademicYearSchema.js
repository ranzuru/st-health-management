const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema(
  {
    schoolYear: {
      type: String, // Updated datatype
      required: true,
      match: /^\d{4}-\d{4}$/, // Regular expression to ensure valid format
    },
    monthFrom: {
      type: String,
      required: true,
    },
    monthTo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

academicYearSchema.index({ schoolYear: 1 }, { unique: true }); // Updated the index

module.exports = mongoose.model("AcademicYear", academicYearSchema);
