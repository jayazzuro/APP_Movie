require("dotenv").config();
const connection = require("../../config/db_movie.js");

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }
    const result = await connection.query(
      `select * from "admin" where "email" = $1 and "password" =  $2`,
      [email, password]
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
