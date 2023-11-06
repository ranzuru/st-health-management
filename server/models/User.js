const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active", // Set the default status to Active
  },
  approved: { type: Boolean, default: false }, // Field to track user approval
  createdAt: { type: Date, default: Date.now }, // Field to track creation date
});

// Create a Counter schema for auto-incrementing IDs
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 100 }, // Initial value
});

const Counter = mongoose.model("Counter", counterSchema);

// Create a function to auto-increment the _id field
userSchema.pre("save", function (next) {
  const user = this;
  Counter.findByIdAndUpdate(
    { _id: "userId" }, // Use a specific document in the Counter collection for users
    { $inc: { sequenceValue: 1 } }, // Increment the sequenceValue
    { new: true, upsert: true } // Create the document if it doesn't exist
  )
    .then((counter) => {
      user._id = `U${counter.sequenceValue}`; // Add the "U" prefix
      next();
    })
    .catch((error) => {
      next(error);
    });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
