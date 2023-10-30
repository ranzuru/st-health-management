const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema(
  {
    yearFrom: {
      type: Number,
      required: true,
    },
    yearTo: {
      type: Number,
      required: true,
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

academicYearSchema.index({ yearFrom: 1, yearTo: 1 }, { unique: true });

module.exports = mongoose.model("AcademicYear", academicYearSchema);
