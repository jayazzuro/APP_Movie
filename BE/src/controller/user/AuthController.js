const moment = require("moment");
const connection = require("../../config/db_movie.js");
const email = require("../../services/emailService.js");
const crypto = require("crypto");

// Đăng nhập
exports.postLoginApi = async (req, res) => {
  const { gmail, password } = req.body;
  try {
    if (!gmail || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }
    const result = await connection.query(
      `select * from "users" where "gmail" = $1 and "passWord" =  $2`,
      [gmail, password]
    );
    if (result.rows.length > 0) {
      return res.json({
        success: true,
        message: "Đăng nhập thành công",
        user: result.rows[0],
      });
    } else {
      return res.json({ success: false, message: "Sai email hoặc mật khẩu" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng kí
exports.postRegisterApi = async (req, res) => {
  const { name, gmail, passWord, RepassWord, phone } = req.body;
  try {
    if (!name || !gmail || !passWord || !RepassWord || !phone) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const exis = await connection.query(
      `SELECT * FROM "users" WHERE "gmail" = $1 LIMIT 1`,
      [gmail]
    );

    if (exis.rows.length > 0) {
      return res.json({ success: false, message: "Email đã tồn tại" });
    }

    if (passWord !== RepassWord) {
      return res.status(400).json({ message: "Mật khẩu không khớp" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss");

    const token = crypto.randomBytes(32).toString("hex");

    const insertUser = await connection.query(
      `INSERT INTO "users" ("name", "gmail", "passWord", "phone", "verify_token", "is_verified", "otp_code", "otp_expires") 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING "idKH"`,
      [name, gmail, passWord, phone, token, 0, otp, otpExpires]
    );

    if (insertUser.rowCount > 0) {
      const userId = insertUser.rows[0].idKH;

      await email.sendEmail(gmail, name, otp);

      return res.status(200).json({
        success: true,
        user: {
          idKH: userId,
          name,
          gmail,
          phone,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
