const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema(
  {
    schoolYear: {
      type: String,
      required: true,
      match: /^\d{4}-\d{4}$/,
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
      enum: ["Active", "Completed", "Planned"],
      required: true,
    },
  },
  { timestamps: true }
);

academicYearSchema.index({ schoolYear: 1 }, { unique: true }); // Updated the index

academicYearSchema.pre("remove", async function (next) {
  const count = await mongoose
    .model("ClassEnrollment")
    .countDocuments({ academicYear: this._id });
  if (count > 0) {
    throw new Error(
      "Cannot delete AcademicYear because it is referenced by ClassEnrollment documents."
    );
  }
  next();
});

module.exports = mongoose.model("AcademicYear", academicYearSchema);
