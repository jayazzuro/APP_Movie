const connection = require("../../config/db_movie");
// API thể hiện thông tin cho khách hàng cho trang profile p
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await connection.query(
      `SELECT "name", "gmail", "phone" FROM "users" WHERE "idKH" = $1`,
      [id]
    );
    if (result.rows.length > 0) {
      return res.json({
        success: true,
        user: result.rows[0],
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy user" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
