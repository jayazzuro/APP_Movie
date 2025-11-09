const connection = require("../../config/db_movie");
// Lấy rating của user cho một phim
exports.getUserRating = async (req, res) => {
  const { idKH, idmv } = req.params;

  try {
    const result = await connection.query(
      `SELECT rating 
         FROM "watch_history" 
         WHERE "idKH" = $1 AND "idmv" = $2`,
      [idKH, idmv]
    );

    if (result.rows.length > 0) {
      return res.json({ success: true, rating: result.rows[0].rating });
    } else {
      return res.json({ success: true, rating: null });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lấy danh sách phim đã xem gần đây thêm
exports.getWatchHistory = async (req, res) => {
  const { idKH } = req.params;
  try {
    const result = await connection.query(
      `SELECT wh.id, wh.progress, wh.rating, wh.watched_at,
                m.idmv, m."TenPhim", m."HinhAnh", m."Rate"
         FROM "watch_history" wh
         JOIN "movies" m ON wh."idmv" = m."idmv"
         WHERE wh."idKH" = $1
         ORDER BY wh."watched_at" DESC
         LIMIT 10`,
      [idKH]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error getWatchHistory:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lưu lịch sử xem phim thêm
exports.addWatchHistory = async (req, res) => {
  const { idKH, idmv, progress, rating } = req.body;

  if (!idKH || !idmv) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu idKH hoặc idmv" });
  }

  try {
    const existing = await connection.query(
      `SELECT * FROM "watch_history" WHERE "idKH" = $1 AND "idmv" = $2`,
      [idKH, idmv]
    );

    if (existing.rows.length > 0) {
      await connection.query(
        `UPDATE "watch_history"
           SET "progress" = $1, "rating" = $2, "watched_at" = NOW()
           WHERE "idKH" = $3 AND "idmv" = $4`,
        [progress ?? 1.0, rating ?? null, idKH, idmv]
      );
    } else {
      await connection.query(
        `INSERT INTO "watch_history" ("idKH", "idmv", "progress", "rating", "watched_at")
           VALUES ($1, $2, $3, $4, NOW())`,
        [idKH, idmv, progress ?? 1.0, rating ?? null]
      );
    }

    return res.json({ success: true, message: "Đã lưu lịch sử xem phim" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
