const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    lrn: {
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
    is4p: {
      type: Boolean,
      required: true,
    },
    parentName1: {
      type: String,
      required: true,
    },
    parentContact1: {
      type: Number,
      required: true,
    },
    parentName2: {
      type: String,
      default: "",
    },
    parentContact2: {
      type: Number,
      default: null,
    },
    address: {
      type: String,
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

studentProfileSchema.index({ lrn: 1 });

const StudentProfileSchema = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);
module.exports = StudentProfileSchema;
