const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  height2: {
    type: Number,
    required: true,
  },
  bmi: {
    type: Number,
    required: true,
  },
  bmiCategory: {
    type: String,
    required: true,
  },
  hfa: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: true,
  },
  
}, {timestamps: true});

const Schema = mongoose.model("nutritional_status", schema);

module.exports = Schema;
