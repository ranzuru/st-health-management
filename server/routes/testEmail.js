// routes/testEmail.js
const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/emailService");

router.get("/send-test-email", async (req, res) => {
  try {
    await sendEmail(
      "support@sthealthplus.tech", // Replace with your email for testing
      "Test Email from Postmark",
      "<strong>Hello from Postmark!</strong>"
    );
    res.send("Test email sent successfully");
  } catch (error) {
    res.status(500).send("Failed to send test email");
  }
});

module.exports = router;
