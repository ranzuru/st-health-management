const mongoose = require("mongoose");

const schema = new mongoose.Schema({
section: {
  type: Date,
  required: true,
},
action: {
    type: Date,
    required: true,
},
details: {
    type: String,
    required: true,
},
}, {timestamps: true});

const Schema = mongoose.model("log_record", schema);

module.exports = Schema;
