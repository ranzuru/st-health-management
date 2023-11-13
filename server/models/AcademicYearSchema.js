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

academicYearSchema.index({ status: 1, schoolYear: 1 }, { unique: true }); // Updated the index

// Pre-save hook
academicYearSchema.pre("save", async function (next) {
  if (this.status === "Active") {
    const existingActive = await this.constructor.findOne({ status: "Active" });
    if (
      existingActive &&
      existingActive._id.toString() !== this._id.toString()
    ) {
      throw new Error("There can only be one active AcademicYear.");
    }
  }
  next();
});
// Pre-remove hook
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
