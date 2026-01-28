const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `"Ecommerce App" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Your Email Verification OTP",
    html: `
      <h2>Your OTP for Email Verification</h2>
      <p>Use the OTP below to verify your email:</p>
      <h1 style="letter-spacing:3px">${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `
  });

  console.log(`📧 OTP SENT → ${to}: ${otp}`);
}

module.exports = { sendOtpEmail };
