require("dotenv").config();
const nodemailer = require("nodemailer");

// Gửi xác nhận tài khoản
const transporterVerify = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Gửi OTP reset mật khẩu
const transporterReset = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

module.exports = { transporterVerify, transporterReset };
