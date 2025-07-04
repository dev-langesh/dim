const nodemailer = require("nodemailer");
const { env } = require("../../../config/env");
const fs = require("fs/promises");
const Handlebars = require("handlebars");
const path = require("path");
const { AppError } = require("../../../utils/error");
const { NotificationErrors } = require("../../../errors/notificationErrors");

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, text }) {
  try {
    // Define the email options
    const mailOptions = {
      from: env.SMTP_USER,
      to,
      subject,
      text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new AppError(NotificationErrors.EMAIL_SEND_FAILED);
  }
}

async function sendEmailWithHtml({ to, subject, template, data }) {
  try {
    const html = await loadTemplate(template, data);

    const mailOptions = {
      from: env.SMTP_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new AppError(NotificationErrors.EMAIL_SEND_FAILED);
  }
}

async function loadTemplate(templateName, data) {
  if (!templateName) {
    console.log("Template name is required");
    throw new AppError(NotificationErrors.EMAIL_SEND_FAILED);
  }

  const templatePath = path.join(
    __dirname,
    "templates",
    `${templateName}.html`
  );
  let templateSource;

  try {
    templateSource = await fs.readFile(templatePath, "utf-8");
  } catch (err) {
    console.error(`Failed to load template ${templateName}:`, err.message);
    throw new AppError(NotificationErrors.EMAIL_SEND_FAILED);
  }

  const template = Handlebars.compile(templateSource);
  return template(data);
}

const emailService = {
  sendEmail,
  sendEmailWithHtml,
};

module.exports = { emailService };
