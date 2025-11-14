import React, { useState } from "react";
import axios from "axios";
import { API } from "../api/config";

function PackageAdd() {
  const [newPackage, setNewPackage] = useState({
    namepk: "",
    mo_ta: "",
    gia: "",
    dvt: "",
    so_ngay_hieu_luc: "",
    la_goi_dung_thu: false,
    trang_thai: "hoatdong",
  });

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API.ADD_PACKAGE, newPackage);
      alert("Thêm gói đăng ký thành công!");
      setNewPackage({
        namepk: "",
        mo_ta: "",
        gia: "",
        dvt: "",
        so_ngay_hieu_luc: "",
        la_goi_dung_thu: false,
        trang_thai: "hoatdong",
      });
    } catch (err) {
      alert("Không thể thêm gói. Kiểm tra lại API hoặc dữ liệu!");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3">Thêm gói đăng ký mới</h3>
      <form
        className="p-4 border rounded shadow-sm bg-light"
        onSubmit={handleAddPackage}
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <div className="mb-3">
          <label className="form-label">Tên gói</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên gói..."
            value={newPackage.namepk}
            onChange={(e) =>
              setNewPackage({ ...newPackage, namepk: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            placeholder="Mô tả chi tiết..."
            rows="3"
            value={newPackage.mo_ta}
            onChange={(e) =>
              setNewPackage({ ...newPackage, mo_ta: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giá (VNĐ)</label>
          <input
            type="number"
            className="form-control"
            placeholder="Nhập giá..."
            value={newPackage.gia}
            onChange={(e) =>
              setNewPackage({ ...newPackage, gia: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Đơn vị</label>
          <input
            type="text"
            className="form-control"
            placeholder="VD: VNĐ, USD..."
            value={newPackage.dvt}
            onChange={(e) =>
              setNewPackage({ ...newPackage, dvt: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Số ngày hiệu lực</label>
          <input
            type="number"
            className="form-control"
            placeholder="Nhập số ngày..."
            value={newPackage.so_ngay_hieu_luc}
            onChange={(e) =>
              setNewPackage({
                ...newPackage,
                so_ngay_hieu_luc: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="trialPackage"
            checked={newPackage.la_goi_dung_thu}
            onChange={(e) =>
              setNewPackage({
                ...newPackage,
                la_goi_dung_thu: e.target.checked,
              })
            }
          />
          <label className="form-check-label" htmlFor="trialPackage">
            Là gói dùng thử
          </label>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Thêm gói
        </button>
      </form>
    </div>
  );
}

export default PackageAdd;
