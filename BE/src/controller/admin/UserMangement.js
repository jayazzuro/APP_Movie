const connection = require("../../config/db_movie.js");
exports.getUser = async (req, res) => {
  try {
    const result = await connection.query(`select * from "users"`);
    if (result.rowCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Lấy dữ liệu thành công",
        users: result.rows,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { idKH } = req.params;
  try {
    const userQuery = await connection.query(
      `select * from "users" where "idKH" = $1`,
      [idKH]
    );
    if (userQuery.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }
    const subQuery = await connection.query(
      `SELECT 
          us.mdk,
          sp.namepk,
          sp.gia,
          us.startday,
          us.endday,
          us.trangthai,
          us.la_goi_dung_thu
       FROM user_sub us
       JOIN subpackages sp ON us.idpk = sp.idpk
       WHERE us.idkh = $1
       ORDER BY us.startday DESC`,
      [idKH]
    );
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết người dùng thành công",
      user: userQuery.rows[0],
      subscriptions: subQuery.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
