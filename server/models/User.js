const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
      default: "Active",
    },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create a Counter schema for auto-incrementing IDs
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 100 }, // Initial value
});

const Counter = mongoose.model("Counter", counterSchema);

// Create a function to auto-increment the _id field
userSchema.pre("save", function (next) {
  if (this.isNew) {
    Counter.findByIdAndUpdate(
      { _id: "userId" },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true }
    )
      .then((counter) => {
        this._id = `U${counter.sequenceValue}`;
        next();
      })
      .catch((error) => {
        next(error);
      });
  } else {
    next(); // Skip the ID increment if the document already exists
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
