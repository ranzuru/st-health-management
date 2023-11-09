const mongoose = require("mongoose");

const schema = new mongoose.Schema({
section: {
  type: String,
  required: true,
},
action: {
    type: String,
    required: true,
},
details: {
    type: String,
    required: true,
},
userId: {
  type: String,
  default: "",
},
}, {timestamps: true});

const LogSchema = mongoose.model("log_record", schema);

module.exports = LogSchema;