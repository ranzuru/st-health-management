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
    nameExtension: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      unique: true,
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