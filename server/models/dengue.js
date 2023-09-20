const mongoose = require("mongoose");

const schema = new mongoose.Schema({
onsetDate: {
  type: Date,
  required: true,
},
admissionDate: {
    type: Date,
    required: true,
},
admissionHospital: {
    type: String,
    required: true,
},
dischargeDate: {
    type: Date,
    required: true,
},
}, {timestamps: true});

const Schema = mongoose.model("dengue_record", schema);

module.exports = Schema;
