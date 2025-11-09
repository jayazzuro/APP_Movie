const { transporterVerify, transporterReset } = require("../config/email_user");

// Gửi email xác nhận tài khoản
const sendEmail = async (gmail, name, otp) => {
  try {
    await transporterVerify.sendMail({
      from: process.env.MAIL_USER,
      to: gmail,
      subject: "Xác nhận tài khoản",
      html: `
        <p>Chào ${name},</p>
        <p>Mã xác thực của bạn là: <b>${otp}</b></p>
        <p><b>Mã có hiệu lực trong 5 phút</b></p>
      `,
    });
  } catch (error) {
    console.error(" Lỗi gửi email xác thực:", error);
  }
};

// Gửi lại OTP
const SendOTP = async (gmail, otp) => {
  try {
    await transporterVerify.sendMail({
      from: process.env.MAIL_USER,
      to: gmail,
      subject: "Gửi lại mã OTP",
      html: `
        <p>Xin chào,</p>
        <p>Mã xác thực mới của bạn là: <b>${otp}</b></p>
        <p><b>Mã có hiệu lực trong 5 phút</b></p>
      `,
    });
    console.log(" Gửi lại OTP thành công đến:", gmail);
  } catch (error) {
    console.error(" Lỗi gửi lại OTP:", error);
  }
};

// Gửi OTP reset password (dùng mail riêng)
const sendResetPassOTP = async (gmail, otp) => {
  try {
    await transporterReset.sendMail({
      from: process.env.MAIL_USER,
      to: gmail,
      subject: "Xác thực OTP - Quên mật khẩu",
      html: `
        <p>Xin chào,</p>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
        <p>Mã OTP của bạn là: <b>${otp}</b></p>
        <p><b>Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</b></p>
      `,
    });
  } catch (error) {
    console.error(" Lỗi gửi email reset password:", error);
  }
};

module.exports = { sendEmail, SendOTP, sendResetPassOTP };
