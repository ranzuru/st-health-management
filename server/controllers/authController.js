// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

exports.register = async (req, res) => {
  try {
    // Extract user data from the request body
    const { firstName, lastName, phoneNumber, email, password, gender, role } =
      req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !password ||
      !gender ||
      !role
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      gender,
      role,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check if the user is active
    if (user.status !== "Active") {
      return res.status(401).json({ error: "User is not active" });
    }

    // Check if the user is approved
    if (!user.approved) {
      return res.status(401).json({ error: "User not approved" });
    }

    // Check if the password is valid
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Generate a refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d", // Refresh token valid for 7 days
      }
    );

    res.status(200).json({ token, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "An error occurred is", details: error.message });
  }
};

exports.refreshToken = (req, res) => {
  return res.status(200).json({ newToken: req.newToken });
};
