import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../api/config";
import { useNavigate } from "react-router-dom";

function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axios.get(API.PACK);
      setPackages(res.data.subpackage || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách gói:", err);
    }
  };

  const toggleStatus = async (idpk, currentStatus) => {
    const newStatus =
      currentStatus === "hoatdong" ? "dunghoatdong" : "hoatdong";
    try {
      await axios.put(API.UPDATE_PACKAGE(idpk), { trang_thai: newStatus });
      fetchPackages();
    } catch (err) {
      console.error("Lỗi khi đổi trạng thái:", err);
    }
  };

  // Xóa gói
  const deletePackage = async (idpk, trang_thai) => {
    if (trang_thai === "hoatdong") {
      alert("Không thể xóa gói đang hoạt động! Vui lòng dừng hoạt động trước.");
      return;
    }
    if (!window.confirm("Bạn có chắc muốn xóa gói này không?")) return;

    try {
      await axios.delete(API.DELETE_PACKAGE(idpk));
      fetchPackages();
    } catch (err) {
      console.error("Lỗi khi xóa gói:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách gói đăng ký</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard/add-package")}
        >
          Thêm gói
        </button>
      </div>

      {packages.length === 0 ? (
        <p className="text-muted">Chưa có gói nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-info">
              <tr>
                <th>ID</th>
                <th>Tên gói</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Đơn vị</th>
                <th>Số ngày hiệu lực</th>
                <th>Dùng thử</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.idpk}>
                  <td>{pkg.idpk}</td>
                  <td>{pkg.namepk}</td>
                  <td>{pkg.mo_ta}</td>
                  <td>{pkg.gia} VNĐ</td>
                  <td>{pkg.dvt}</td>
                  <td>{pkg.so_ngay_hieu_luc}</td>
                  <td>{pkg.la_goi_dung_thu ? "Có" : "Không"}</td>
                  <td>{pkg.trang_thai}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-1"
                      onClick={() => toggleStatus(pkg.idpk, pkg.trang_thai)}
                    >
                      {pkg.trang_thai === "hoatdong"
                        ? "Dừng hoạt động"
                        : "Hoạt động"}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deletePackage(pkg.idpk, pkg.trang_thai)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PackageManagement;
