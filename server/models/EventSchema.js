const mongoose = require("mongoose");

// Define a schema for calendar events
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  // Add any additional fields you need for your events
});

// Create a model for calendar events using the schema
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
