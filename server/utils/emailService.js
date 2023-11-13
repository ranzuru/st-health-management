const postmark = require("postmark");

const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);

const sendEmail = async (to, subject, htmlBody) => {
  try {
    const response = await client.sendEmail({
      From: process.env.EMAIL_SENDER_ADDRESS,
      To: to,
      Subject: subject,
      HtmlBody: htmlBody,
    });
    console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendEmailWithTemplate = async (to, templateId, templateModel) => {
  try {
    const response = await client.sendEmailWithTemplate({
      From: process.env.EMAIL_SENDER_ADDRESS,
      To: to,
      TemplateId: templateId,
      TemplateModel: templateModel,
    });
    console.log("Email sent with template:", response);
  } catch (error) {
    console.error("Error sending email with template:", error);
  }
};

const sendResetPasswordEmail = async (to, resetUrl) => {
  try {
    const response = await client.sendEmailWithTemplate({
      From: process.env.EMAIL_SENDER_ADDRESS,
      To: to,
      TemplateAlias: "code-your-own-2",
      TemplateModel: {
        reset_password_url: resetUrl,
      },
    });
    console.log("Password reset email sent with template:", response);
  } catch (error) {
    console.error("Error sending password reset email with template:", error);
  }
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendEmailWithTemplate, // Add this line to export the new function
};
