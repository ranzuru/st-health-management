const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  lrn: {
    type: String,
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
    type: Date,
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
  parentMobile1: {
    type: Number,
    required: true,
  },
  parentName2: {
    type: String,
    default: "None",
  },
  parentMobile2: {
    type: String,
    default: "None",
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  student_class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "class_profile", // Reference to the 'ClassProfile' model
    required: true,
  },
}, {timestamps: true});

const StudentSchema = mongoose.model("student_profile", schema);

module.exports = StudentSchema;
