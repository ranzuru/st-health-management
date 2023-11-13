const express = require("express");
const { sendOTP, verifyOTP } = require("../controllers/otpController");
const router = express.Router();

router.post("/request-otp", async (req, res) => {
  try {
    const userContact = req.body.email; // replace with actual email field
    const token = await sendOTP(userContact);
    res.status(200).json({ token: token }); // Send the JWT to the client
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send OTP.");
  }
});

router.post("/verify-otp", (req, res) => {
  const { token, otp } = req.body;
  const isValid = verifyOTP(token, otp);
  if (isValid) {
    res.json({ message: "OTP is valid." });
  } else {
    res.status(400).json({ message: "Invalid OTP or it has expired." });
  }
});

module.exports = router;
