const mongoose = require("mongoose");

const classProfileSchema = new mongoose.Schema(
  {
    grade: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Active",
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyProfile", // Reference to the 'FacultyProfile' model
      required: true,
    },
  },
  { timestamps: true }
);

classProfileSchema.index({ grade: 1, section: 1 }, { unique: true });

module.exports = mongoose.model("ClassProfile", classProfileSchema);
