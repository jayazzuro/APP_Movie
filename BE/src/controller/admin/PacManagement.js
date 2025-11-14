const connection = require("../../config/db_movie.js");

exports.getPackage = async (req, res) => {
  try {
    const result = await connection.query(`
    select * from "subpackages" 
    `);
    if (result.rowCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Lấy dữ liệu thành công",
        subpackage: result.rows,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPackageById = async (req, res) => {
  const { idpk } = req.params;
  try {
    const result = await connection.query(
      `
        select * from "subpackages" where "idpk" = $1 `,
      [idpk]
    );
    if (result.rowCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Lấy dữ liệu thành công",
        subpackage: result.rows,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePackage = async (req, res) => {
  const { idpk } = req.params;
  const { trang_thai } = req.body;
  try {
    const result = await connection.query(
      `UPDATE subpackages SET trang_thai = $1 WHERE idpk = $2`,
      [trang_thai, idpk]
    );
    res.status(200).json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePack = async (req, res) => {
  const { idpk } = req.params;
  try {
    const check = await connection.query(
      `
    SELECT * 
    FROM "subpackages"
    WHERE "idpk" = $1 AND "trang_thai" = 'dunghoatdong'
    `,
      [idpk]
    );
    if (check.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Chỉ xóa được gói đã dừng hoạt động",
      });
    }

    const result = await connection.query(
      `DELETE FROM "subpackages" WHERE "idpk" = $1`,
      [idpk]
    );

    return res.status(200).json({
      success: true,
      message: "Xóa gói thành công (gói đã dừng hoạt động).",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addPack = async (req, res) => {
  const {
    namepk,
    mo_ta,
    gia,
    dvt,
    so_ngay_hieu_luc,
    la_goi_dung_thu,
    trang_thai,
  } = req.body;
  try {
    const result = await connection.query(
      `
    insert into "subpackages" (namepk,
        "mo_ta",
        "gia",
        "dvt",
        "so_ngay_hieu_luc",
        "la_goi_dung_thu",
        "trang_thai") values ($1,$2,$3,$4,$5,$6,$7)
    `,
      [namepk, mo_ta, gia, dvt, so_ngay_hieu_luc, la_goi_dung_thu, trang_thai]
    );
    if (result.rowCount > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Thêm gói thành công" });
    }
    return res
      .status(400)
      .json({ success: false, message: "Không thể thêm gói" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
