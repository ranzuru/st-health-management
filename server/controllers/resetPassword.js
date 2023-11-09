const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const { sendResetPasswordEmail } = require("../utils/emailService");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // It's a good security practice to use generic messages
      return res.status(404).json({
        message:
          "If that email address is in our database, we will send you an email to reset your password.",
      });
    }

    // Create a reset token that expires in 1 hour
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Construct the reset link
    const resetLink = `http://localhost:8080/reset-password?token=${resetToken}`;

    // Create a test account and transporter inside the function
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Send email
    let info = await transporter.sendMail({
      from: '"Your App Name" <yourapp@example.com>', // sender address
      to: email, // list of receivers
      subject: "Password Reset Request", // Subject line
      text: "Here is your password reset link: " + resetLink, // plain text body
      html: `<b>Click here to reset your password:</b> <a href="${resetLink}">Reset Password</a>`, // html body
    });

    // Log the message or handle it as needed
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      message: "Password reset email sent successfully. Check your inbox.",
      resetToken: resetToken, // You might want to omit this in a production environment for security
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message: "An error occurred while attempting to reset password.",
    });
  }
};

// Resets the user's password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Password reset token has expired." });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid password reset token." });
    } else {
      console.error("Reset password error:", error);
      res
        .status(500)
        .json({ message: "An error occurred while resetting your password." });
    }
  }
};

module.exports = {
  sendPasswordResetEmail,
  resetPassword,
};
