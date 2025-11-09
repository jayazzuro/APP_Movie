const connection = require("../../config/db_movie.js");
const upload = require("../../middlewares/upload.js");
// Quản lý phim - Lấy danh sách tất cả phim
exports.getMovie = async (req, res) => {
  try {
    const result = await connection.query(`SELECT * FROM "movies" `);
    res.json({ movies: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  const { idmv } = req.params;

  try {
    const result = await connection.query(
      `SELECT * FROM "movies" WHERE "idmv" = $1`,
      [idmv]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phim" });
    }

    return res.status(200).json({ success: true, movie: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa Phim
exports.deleteMovie = async (req, res) => {
  const { idmv } = req.params;
  if (!idmv) {
    return res.status(400).json({ success: false, message: "Chưa có ID phim" });
  }
  try {
    const result = await connection.query(
      ` delete from "movies" where "idmv" = $1`,
      [idmv]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phim để xóa" });
    }
    res.status(200).json({ success: true, message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Them Phim
exports.addMovie = async (req, res) => {
  upload.single("HinhAnh")(req, res, async (err) => {
    const { TenPhim, TheLoai, MoTa, ThoiLuong, Video, Rate } = req.body;
    const default_image = "default_image.jpg";
    const HinhAnh = req.file ? req.file.filename : default_image;

    try {
      const result = await connection.query(
        `insert into "movies" ("TenPhim", "TheLoai", "MoTa", "ThoiLuong", "HinhAnh", "Video", "Rate" )
        values ($1, $2, $3,$4,$5,$6,$7)
        `,
        [TenPhim, TheLoai, MoTa, ThoiLuong, HinhAnh, Video, Rate]
      );
      if (result.rowCount > 0) {
        return res
          .status(200)
          .json({ success: true, message: "Thêm phim thành công" });
      }
      return res
        .status(400)
        .json({ success: false, message: "Không thể thêm phim" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Cập nhật Phim
exports.PutUpLoadMovie = async (req, res) => {
  upload.single("HinhAnh")(req, res, async (err) => {
    const { idmv } = req.params;
    const { TenPhim, TheLoai, MoTa, ThoiLuong, Video, Rate } = req.body;
    const default_image = "default_image.jpg";
    const HinhAnh = req.file ? req.file.filename : default_image;
    if (!idmv) {
      return res
        .status(400)
        .json({ success: false, message: "Chưa có ID phim" });
    }
    try {
      const result = await connection.query(
        `UPDATE "movies"
      SET "TenPhim" = $1, "TheLoai" = $2, "MoTa"=$3,"ThoiLuong"=$4,"HinhAnh"=$5,"Video"=$6, "Rate" = $7
      WHERE "idmv" = $8;`,
        [TenPhim, TheLoai, MoTa, ThoiLuong, HinhAnh, Video, Rate, idmv]
      );
      return res.status(200).json({
        success: true,
        message: "Cập nhật phim thành công!",
        updatedMovie: {
          idmv,
          TenPhim,
          TheLoai,
          MoTa,
          ThoiLuong,
          HinhAnh,
          Video,
          Rate,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
