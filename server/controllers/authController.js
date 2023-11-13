// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { createLog } = require("../routes/recordLogRouter.js");
const { sendOTP, verifyOTP } = require("../controllers/otpController.js");

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
    await createLog('Registration - External', 'CREATE', `${newUser}`, "");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

//Automate refreshToken
exports.refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const newToken = jwt.sign(
      { userId: decodedToken.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).json({ newToken });
  } catch (error) {
    console.error("Refresh Token failed:", error);
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};

exports.internalRegister = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password, gender, role } =
      req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !password ||
      !gender
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
    await createLog('Registration - Internal', 'CREATE', `${newUser}`, req.userData.userId);
    res
      .status(201)
      .json({ message: "User registered successfully internally" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred during internal registration" });
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

    const otpToken = await sendOTP(user.email);

    const tempAuthToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m", // Short validity for this temp token
      }
    );

    // Send back the tempAuthToken and the OTP token (encrypted user secret)
    res.status(200).json({ tempAuthToken, otpToken });
    await createLog('Login', 'RETRIEVE', `${user}`, "");
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred is", details: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { tempAuthToken } = req.body; // Use the temporary token to identify the user session

    // Verify the temporary auth token to get the user ID
    const decoded = jwt.verify(tempAuthToken, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is active and approved
    if (user.status !== "Active" || !user.approved) {
      return res
        .status(401)
        .json({ error: "User is not active or not approved" });
    }

    // Resend the OTP
    const otpToken = await sendOTP(user.email); // Assuming sendOTP handles the sending

    // Respond with success message
    res.status(200).json({ message: "OTP has been resent", otpToken });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid Token" });
    }
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { tempAuthToken, otpToken, otp } = req.body;

  try {
    // Verify the temporary auth token to get the user ID
    const decoded = jwt.verify(tempAuthToken, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Now verify the OTP using your OTPControllers method
    if (verifyOTP(otpToken, otp)) {
      // OTP is correct, now generate the final access and refresh tokens
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Access token valid for 1 hour
      });
      const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d", // Refresh token valid for 7 days
        }
      );

      const userResponse = {
        _id: user._id,
        email: user.email,
        name: user.firstName,
        role: user.role,
      };

      // Send the final tokens
      res.status(200).json({ token, refreshToken, user: userResponse });
    } else {
      // OTP verification failed
      res.status(401).json({ error: "Invalid or expired OTP." });
    }
  } catch (error) {
    // Temporary auth token verification failed or other errors
    res.status(401).json({
      error: "Invalid temporary auth token or error in OTP verification.",
      details: error.message,
    });
  }
};
