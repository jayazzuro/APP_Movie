const email = require("../../services/emailService.js");
const connection = require("../../config/db_movie");
// API quên mật khẩu
exports.forgotPassword = async (req, res) => {
  const { gmail } = req.body;
  try {
    if (!gmail) {
      return res.status(400).json({ message: "Thiếu email" });
    }

    const result = await connection.query(
      `SELECT * FROM "users" WHERE "gmail" = $1 LIMIT 1`,
      [gmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await connection.query(
      `UPDATE "users" SET "otp_code" = $1, "otp_expires" = $2 WHERE "gmail" = $3`,
      [otp, expires, gmail]
    );

    await email.sendResetPassOTP(gmail, otp);

    return res.status(200).json({
      success: true,
      message: "Đã gửi OTP đến email",
      data: {
        idKH: result.rows[0].idKH,
        gmail: result.rows[0].gmail,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  const { gmail, otp, newPassword, rePassword } = req.body;

  try {
    if (!gmail || !otp || !newPassword || !rePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin" });
    }

    if (newPassword !== rePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu không khớp" });
    }

    const result = await connection.query(
      `SELECT * FROM "users" WHERE "gmail" = $1 LIMIT 1`,
      [gmail]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    const user = result.rows[0];
    const now = new Date();

    if (user.otp_code !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Mã OTP không đúng" });
    }

    if (now > new Date(user.otp_expires)) {
      return res
        .status(400)
        .json({ success: false, message: "Mã OTP đã hết hạn" });
    }

    await connection.query(
      `UPDATE "users" SET "passWord" = $1, "otp_code" = NULL, "otp_expires" = NULL WHERE "gmail" = $2`,
      [newPassword, gmail]
    );

    return res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API cập nhật mật khẩu cho khách hàng cho trang profile
exports.changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword, confirmPassword } = req.body;
  if (!userId || !oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
  }

  try {
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu nhập lại không khớp" });
    }
    const result = await connection.query(
      `SELECT * FROM "users" WHERE "idKH" = $1 AND "passWord" = $2`,
      [userId, oldPassword]
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không đúng" });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới không được trùng với mật khẩu cũ",
      });
    }
    await connection.query(
      `UPDATE "users" SET "passWord" = $1 WHERE "idKH" = $2`,
      [newPassword, userId]
    );
    return res
      .status(200)
      .json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
