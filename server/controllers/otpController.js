const { totp, authenticator } = require("otplib");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
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

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "cathryn.sanford99@ethereal.email", // generated ethereal user
    pass: "yyncuBcCvACKwJmYsV", // generated ethereal password
  },
});

const sendOTP = async (userContact) => {
  const userSecret = authenticator.generateSecret();
  const otp = generateOTP(userSecret);
  totp.options = { step: 60, window: 1, digits: 6 };
  const token = jwt.sign({ userSecret }, OTP_JWT_SECRET, { expiresIn: "15m" });
  console.log(`Signed token for ${userContact} with secret ${userSecret}`);

  await transporter.sendMail({
    from: '"Your App Name" <your@appdomain.com>',
    to: userContact,
    subject: "Your OTP",
    text: `Your OTP is: ${otp}`,
    html: `<b>Your OTP is: ${otp}</b>`,
  });
  console.log(`Generated OTP for ${userContact}: ${otp}`);

  return token;
};

const verifyOTP = (userToken, otp) => {
  try {
    const decoded = jwt.verify(userToken, OTP_JWT_SECRET);
    console.log(`Decoded JWT for OTP verification: ${JSON.stringify(decoded)}`);
    totp.options = { step: 60, window: 1, digits: 6 };
    const isValid = totp.verify({ token: otp, secret: decoded.userSecret });
    console.log(`OTP verification result for ${otp}: ${isValid}`);
    console.log(
      `TOTP options at verification: ${JSON.stringify(totp.options)}`
    );
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
