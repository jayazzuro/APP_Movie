const connection = require("../../config/db_movie");
const email = require("../../services/emailService.js");

// Xác thực bằng mã OTP
exports.verifyOTP = async (req, res) => {
  const { gmail, otp } = req.body;

  try {
    const result = await connection.query(
      `SELECT * FROM "users" WHERE "gmail" = $1 LIMIT 1`,
      [gmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const user = result.rows[0];
    const now = new Date();

    if (user.is_verified) {
      return res.json({ message: "Tài khoản đã được xác minh rồi" });
    }

    if (user.otp_code !== otp) {
      return res.status(400).json({ message: "Mã OTP không đúng" });
    }

    if (now > new Date(user.otp_expires)) {
      return res.status(400).json({ message: "Mã OTP đã hết hạn" });
    }

    // Update theo idKH
    await connection.query(
      `UPDATE "users" 
           SET "is_verified" = $1, "otp_code" = NULL, "otp_expires" = NULL 
           WHERE "idKH" = $2`,
      [true, user.idKH]
    );

    res.status(200).json({ success: true, message: "Xác minh OTP thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Gửi lại mã OTP P
exports.rendOTP = async (req, res) => {
  const { gmail } = req.body;
  try {
    const result = await connection.query(
      `SELECT * FROM "users" WHERE gmail = $1 LIMIT 1`,
      [gmail]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    const rowsUpdate = await connection.query(
      `UPDATE "users" SET otp_code = $1, otp_expires = $2 WHERE gmail = $3`,
      [otp, expires, gmail]
    );
    if (rowsUpdate.rowCount > 0) {
      await email.SendOTP(gmail, otp);
      res.status(200).json({ success: true, message: "Gửi mã OTP thành công" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Xác thực OTP reset Pass
exports.verifyOTPReset = async (req, res) => {
  const { gmail, otp } = req.body;
  try {
    const result = await connection.query(
      `SELECT * FROM "users" WHERE "gmail" = $1 LIMIT 1`,
      [gmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const user = result.rows[0];
    const now = new Date();

    if (user.otp_code !== otp) {
      return res.status(400).json({ message: "Mã OTP không đúng" });
    }

    if (now > new Date(user.otp_expires)) {
      return res.status(400).json({ message: "Mã OTP đã hết hạn" });
    }

    return res.status(200).json({ success: true, message: "OTP hợp lệ" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Gửi mã OTP resetPass
exports.resendOTPResetpass = async (req, res) => {
  const { gmail } = req.body;
  try {
    const result = await connection.query(
      `SELECT * FROM "users" WHERE "gmail" = $1 LIMIT 1`,
      [gmail]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    const updateResult = await connection.query(
      `UPDATE "users" SET "otp_code" = $1, "otp_expires" = $2 WHERE "gmail" = $3`,
      [otp, expires, gmail]
    );

    if (updateResult.rowCount > 0) {
      await email.sendResetPassOTP(gmail, otp);
      return res
        .status(200)
        .json({ success: true, message: "Gửi lại OTP thành công" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Không thể cập nhật OTP" });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
