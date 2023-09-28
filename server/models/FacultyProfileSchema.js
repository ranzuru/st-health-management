const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Active",
    },
  },
  { timestamps: true }
);

const FacultySchema = mongoose.model("faculty_profile", facultySchema);

module.exports = FacultySchema