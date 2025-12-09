const moment = require("moment");
const connection = require("../../config/db_movie.js");
const axios = require("axios");
const crypto = require("crypto");

const getApi = async (req, res) => {
  try {
    const result = await connection.query(
      `SELECT idmv, "TenPhim", "TheLoai", "MoTa", "embedding" FROM "movies"`
    );
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Kiểm trađăng kí gói xem phim
const checkSubscription = async (req, res) => {
  try {
    const { idkh } = req.params;

    if (!idkh) {
      return res.status(400).json({ success: false, message: "Thiếu idkh" });
    }

    //  Dùng schema đầy đủ (public.user_sub)
    const query = `
      SELECT *
      FROM public.user_sub
      WHERE idkh = $1
        AND trangthai = 'hoatdong'
        AND (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')
            BETWEEN startday AND endday
      LIMIT 1
    `;

    const result = await connection.query(query, [idkh]);

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        active: true,
        data: result.rows[0],
      });
    } else {
      return res.json({
        success: true,
        active: false,
        message: "Người dùng chưa có gói hoạt động hoặc đã hết hạn",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi kiểm tra gói đăng ký",
      error: err.message,
    });
  }
};

//Hiển thị thông tin gói đăng kí
const getAllPackages = async (req, res) => {
  try {
    const result = await connection.query(
      `SELECT "idpk", "namepk", "mo_ta", "gia", "dvt", "so_ngay_hieu_luc", "la_goi_dung_thu", "trang_thai" 
       FROM "subpackages" 
       WHERE "trang_thai" = 'hoatdong'`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
//////Đăng kí gói

const handleSubscription = async (req, res) => {
  try {
    console.log(" Nhận dữ liệu từ Flutter:", req.body);
    const {
      idkh,
      idpk,
      amount = 0,
      orderInfo = "Thanh toán gói dịch vụ",
    } = req.body;

    if (!idkh || !idpk)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu idkh hoặc idpk" });

    const pkg = await connection.query(
      `SELECT "la_goi_dung_thu", "namepk" FROM "subpackages"
       WHERE "idpk" = $1 AND "trang_thai" = 'hoatdong'`,
      [idpk]
    );

    if (pkg.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gói không tồn tại hoặc ngừng hoạt động",
      });
    }

    const laGoiDungThu = pkg.rows[0].la_goi_dung_thu;

    if (laGoiDungThu === true) {
      const trialUsed = await connection.query(
        `SELECT 1 FROM "user_sub" 
         WHERE "idkh" = $1 
           AND "la_goi_dung_thu" = true 
         LIMIT 1`,
        [idkh]
      );

      if (trialUsed.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Bạn đã từng sử dụng gói dùng thử, không thể đăng ký lại.",
        });
      }
    }

    const activeSub = await connection.query(
      `SELECT * FROM "user_sub"
       WHERE "idkh" = $1 AND "trangthai" = 'hoatdong'
       ORDER BY "endday" DESC LIMIT 1`,
      [idkh]
    );

    if (activeSub.rows.length > 0) {
      const current = activeSub.rows[0];
      const now = moment();

      if (now.isBefore(moment(current.endday))) {
        console.log(" Người dùng đã có gói đang hoạt động:", current);
        return res.status(400).json({
          success: false,
          message: `Bạn đang sử dụng gói có mã ${
            current.mdk
          }, còn hiệu lực đến ${moment(current.endday).format(
            "HH:mm:ss DD/MM/YYYY"
          )}. 
          Vui lòng chờ hết hạn để đăng ký gói mới.`,
        });
      }

      await connection.query(
        `UPDATE "user_sub" SET "trangthai" = 'hethan' WHERE "mdk" = $1`,
        [current.mdk]
      );
      console.log(" Gói cũ đã hết hạn → cập nhật thành 'hethan'");
    }

    if (Number(amount) === 0) {
      console.log(" Gói miễn phí → lưu trực tiếp");
      return await createNewPackage(idkh, idpk, res);
    }

    console.log("Bắt đầu gọi MoMo...");
    const momoResponse = await callMomoApi(amount, orderInfo, idkh, idpk);

    if (momoResponse && momoResponse.payUrl) {
      console.log(" MoMo trả về URL:", momoResponse.payUrl);
      return res.json({
        success: true,
        message: "Chuyển hướng đến MoMo để thanh toán",
        payUrl: momoResponse.payUrl,
      });
    } else {
      throw new Error("Không nhận được URL thanh toán từ MoMo");
    }
  } catch (err) {
    console.error(" Lỗi handleSubscription:", err.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi xử lý đăng ký: " + err.message,
    });
  }
};
const createNewPackage = async (idkh, idpk, res) => {
  const pkg = await connection.query(
    `SELECT "so_ngay_hieu_luc", "la_goi_dung_thu" FROM "subpackages"
     WHERE "idpk" = $1 AND "trang_thai" = 'hoatdong'`,
    [idpk]
  );

  if (pkg.rows.length === 0)
    return res.status(404).json({
      success: false,
      message: "Gói không tồn tại hoặc đã ngừng hoạt động",
    });

  const { so_ngay_hieu_luc: soNgay, la_goi_dung_thu } = pkg.rows[0];
  const startday = moment().format("YYYY-MM-DD HH:mm:ss");
  const endday = moment().add(soNgay, "days").format("YYYY-MM-DD HH:mm:ss");

  const nextMdk = (
    await connection.query(
      `SELECT COALESCE(MAX("mdk"), 0) + 1 AS next_mdk FROM "user_sub"`
    )
  ).rows[0].next_mdk;

  const insertResult = await connection.query(
    `INSERT INTO "user_sub" 
      ("mdk", "idkh", "idpk", "startday", "endday", "la_goi_dung_thu", "trangthai")
     VALUES ($1, $2, $3, $4, $5, $6, 'hoatdong')
     RETURNING *`,
    [nextMdk, idkh, idpk, startday, endday, la_goi_dung_thu]
  );

  console.log(" Đăng ký gói thành công:", insertResult.rows[0]);
  return res.json({
    success: true,
    message: " Đăng ký gói thành công",
    data: insertResult.rows[0],
  });
};

//  GỌI API MOMO

const callMomoApi = async (amount, orderInfo, idkh, idpk) => {
  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

  const ngrokUrl = process.env.NGROK;

  const redirectUrl = `${ngrokUrl}/success`;
  const ipnUrl = `${ngrokUrl}/api/momo/callback`;

  const requestType = "captureWallet";
  const extraData = Buffer.from(JSON.stringify({ idkh, idpk })).toString(
    "base64"
  );

  const requestId = partnerCode + Date.now();
  const orderId = requestId;

  const rawSignature =
    `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
    `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
    signature,
    lang: "vi",
  };

  const response = await axios.post(
    "https://test-payment.momo.vn/v2/gateway/api/create",
    requestBody,
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
};

// CALLBACK MOMO (MoMo sẽ gọi vào đây sau khi thanh toán)

const momoCallback = async (req, res) => {
  try {
    console.log("Callback từ MoMo:", req.body);
    const { resultCode, message, extraData } = req.body;

    if (resultCode == 0) {
      const decoded = JSON.parse(
        Buffer.from(extraData, "base64").toString("utf8")
      );
      const { idkh, idpk } = decoded;

      console.log(` Thanh toán thành công cho idkh=${idkh}, idpk=${idpk}`);
      await createNewPackage(idkh, idpk, res);
    } else {
      console.log(" Thanh toán thất bại:", message);
      res.status(400).json({ success: false, message: "Thanh toán thất bại" });
    }
  } catch (err) {
    console.error(" Lỗi callback:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getApi,
  getAllPackages,
  checkSubscription,
  handleSubscription,
  momoCallback,
  createNewPackage,
};
