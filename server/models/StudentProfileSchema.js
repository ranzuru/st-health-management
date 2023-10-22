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
      required: true,
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
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    classProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassProfile", // Reference to the 'ClassProfile' model
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
      required: true,
      enum: [
        "Enrolled",
        "Pending",
        "Graduated",
        "Transferred",
        "Inactive",
        "Dropped",
      ],
      // Enrolled: Currently attending classes.
      // Pending: Application submitted but not yet processed.
      // Graduated: Completed the final academic year.
      // Transferred: Moved to a different school.
      // Inactive: Temporarily not attending for some reason (could be medical, family, etc.)
      // Dropped: Left the school without completing the academic year.
    },
  },
  { timestamps: true }
);

// Create a model for calendar events using the schema
const StudentProfileSchema = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);
module.exports = StudentProfileSchema;
