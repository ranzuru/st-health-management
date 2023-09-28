const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
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
    syFrom: {
      // Represents the start year of the academic year
      type: String,
      required: true,
    },
    syTo: {
      // Represents the end year of the academic year
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
      ref: "faculty_profile", // Reference to the 'FacultyProfile' model
      required: true,
    },
  },
  { timestamps: true }
);

const ClassSchema = mongoose.model("class_profile", classSchema);

module.exports = ClassSchema