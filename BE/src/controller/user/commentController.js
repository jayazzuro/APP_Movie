const connection = require("../../config/db_movie");
const { getIo } = require("../../services/socket");

// API lấy danh sách cmt theo danh sách phim
exports.comment = async (req, res) => {
  const { idmv } = req.params;
  try {
    const result = await connection.query(
      `
    SELECT * FROM "comments" WHERE "idmv" = $1 ORDER BY "createdAt" DESC
    `,
      [idmv]
    );
    if (result.rows.length > 0) {
      return res.status(200).json({ success: true, data: result.rows });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// API thêm cmt mới P S
exports.addCmt = async (req, res) => {
  const { idmv, idKH, text } = req.body;
  if (!idmv || !idKH || !text || text.trim() === "") {
    return res.status(404).json({
      success: false,
      message: "Thiếu dữ liệu hoặc cmt rỗng",
    });
  }
  try {
    const result = await connection.query(
      `
    insert into "comments" ("idmv" , "idKH" , "text" , "createdAt") values ($1,$2,$3 , NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')  RETURNING *
    `,
      [idmv, idKH, text]
    );

    if (result.rows.length > 0) {
      const newComment = {
        id: result.rows.insertId,
        idmv,
        idKH,
        text,
        createdAt: new Date(),
      };

      const io = getIo();
      io.emit("newComment", newComment);
      return res.status(200).json({
        success: true,
        message: "Thêm cmt thành công",
        comment: newComment,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
