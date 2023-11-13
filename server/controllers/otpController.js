const { totp, authenticator } = require("otplib");
const rateLimit = require("express-rate-limit");
const { sendOtpEmail } = require("../utils/emailService");
const jwt = require("jsonwebtoken");

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: "Too many attempts, please try again later",
});

// You should move this to a secure environment variable
const OTP_JWT_SECRET = process.env.OTP_SECRET;

const generateOTP = (userSecret) => {
  return totp.generate(userSecret);
};

const sendOTP = async (userContact) => {
  const userSecret = authenticator.generateSecret();
  const otp = generateOTP(userSecret);
  totp.options = { step: 60, window: 1, digits: 6 };
  const token = jwt.sign({ userSecret }, OTP_JWT_SECRET, { expiresIn: "15m" });

  await sendOtpEmail(userContact, otp); // Send OTP using Postmark
  console.log(`Generated OTP for ${userContact}: ${otp}`);

  return token;
};

const verifyOTP = (userToken, otp) => {
  try {
    const decoded = jwt.verify(userToken, OTP_JWT_SECRET);
    totp.options = { step: 60, window: 1, digits: 6 };
    const isValid = totp.verify({ token: otp, secret: decoded.userSecret });
    return isValid;
  } catch (error) {
    console.log(`Error verifying OTP: ${error.message}`);
    return false;
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  otpVerifyLimiter,
};
