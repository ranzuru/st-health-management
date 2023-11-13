const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendResetPasswordEmail } = require("../utils/emailService");
const bcrypt = require("bcrypt");

const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message:
          "If that email address is in our database, we will send you an email to reset your password.",
      });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await sendResetPasswordEmail(email, resetLink); // Send reset password email using Postmark

    res.status(200).json({
      message: "Password reset email sent successfully. Check your inbox.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message: "An error occurred while attempting to reset password.",
    });
  }
};

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
