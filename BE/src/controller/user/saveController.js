const connection = require("../../config/db_movie");
exports.saveMovie = async (req, res) => {
  const { idKH, idmv, TenPhim, HinhAnh } = req.body;

  if (!idKH || !idmv || !TenPhim || !HinhAnh) {
    return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
  }

  const Ngayluu = new Date();

  try {
    const existing = await connection.query(
      `SELECT * FROM "saves" WHERE "idKH" = $1 AND "idmv" = $2`,
      [idKH, idmv]
    );

    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Phim này đã lưu" });
    }

    await connection.query(
      `INSERT INTO "saves" ("idKH", "idmv", "Ngayluu", "TenPhim", "HinhAnh") VALUES ($1, $2, $3, $4, $5)`,
      [idKH, idmv, Ngayluu, TenPhim, HinhAnh]
    );

    res.status(201).json({ success: true, message: "Lưu phim thành công" });
  } catch (err) {
    console.error("Lỗi khi lưu phim:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
exports.getSavedMovies = async (req, res) => {
  const { idKH } = req.params;

  if (!idKH) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu id người dùng" });
  }

  try {
    const savedMovies = await connection.query(
      `SELECT * FROM "saves" WHERE "idKH" = $1 ORDER BY "Ngayluu" DESC`,
      [idKH]
    );

    res.status(200).json({ success: true, data: savedMovies.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
exports.deleteSavedMovie = async (req, res) => {
  const { idsaves } = req.params;

  if (!idsaves) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu id bản ghi lưu (idsaves)" });
  }

  try {
    const result = await connection.query(
      `DELETE FROM "saves" WHERE "idsaves" = $1`,
      [idsaves]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bản ghi để xóa" });
    }

    res.status(200).json({ success: true, message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
