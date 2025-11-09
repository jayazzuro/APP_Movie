const connection = require("../../config/db_movie.js");
const { runPythonSearch } = require("../../services/embeddingService.js");
const axios = require("axios");

exports.productUploadApi = async (req, res) => {
  try {
    const { TenPhim } = req.body;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Chưa upload ảnh" });
    }
    if (!TenPhim) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu tên phim" });
    }
    const imageUrl = file.filename;

    const [result] = await connection.query(
      `INSERT INTO "movies" ("TenPhim", "HinhAnh") 
          VALUES ($1, $2) 
          RETURNING "idmv", "TenPhim", "HinhAnh"`,
      [TenPhim, imageUrl]
    );

    const newMovie = {
      id: result.insertId,
      TenPhim,
      HinhAnh: imageUrl,
    };

    return res.json({
      success: true,
      message: "Upload thành công",
      product: newMovie,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

exports.Item_Movie_Cartoon = async (req, res) => {
  try {
    const result = await connection.query(
      `
   select * from "movies" where "TheLoai" = $1 `,
      ["Sci-Fi"]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ success: true, data: result.rows });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.Item_Movie_Action = async (req, res) => {
  try {
    const [row] = await connection.query(
      `select * from "movies" where "TheLoai" = 'Hành Động'`
    );
    if (row.length > 0) {
      res.status(200).json({ success: true, data: row });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// API TÌM KIẾM AI
exports.search = async (req, res) => {
  const { keyword } = req.query;

  try {
    if (!keyword || keyword.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu từ khóa tìm kiếm" });
    }

    const aiResult = await runPythonSearch(keyword);

    return res.status(200).json({
      success: true,
      source: "AI",
      data: aiResult.results,
      time_ms: aiResult.time_ms,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
// API chiếu phim video
exports.movie_video = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await connection.query(
      `select "Video" from "movies" where "idmv" = $1`,
      [id]
    );
    if (result.rows.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phim" });
    }
    return res.status(200).json({
      success: true,
      message: "Phim được tải thành công",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
// API gọi sang FastAPI
exports.recommendMovies = async (req, res) => {
  const { idKH } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/recommend/${idKH}`);
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Lỗi gọi AI" });
  }
};
