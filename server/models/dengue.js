const mongoose = require("mongoose");

const schema = new mongoose.Schema({
onsetDate: {
  type: Date,
  required: true,
},
admissionDate: {
    type: Date,
    default: null,
},
admissionHospital: {
    type: String,
    default: "",
},
dischargeDate: {
    type: Date,
    default: null,
},
student_data: {
    type: String,
    ref: "student_profile", 
    required: true,
},
student_age: {
  type: Number,
  required: true,
},
class_data: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "class_profile", 
  required: true,
},
adviser_data: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "faculty_profile", 
  required: true,
},
}, {timestamps: true});

const Schema = mongoose.model("dengue_record", schema);

module.exports = Schema;
