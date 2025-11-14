import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../api/config";

function UserDetail() {
  const { id } = useParams(); // sửa từ idKH → id
  const [user, setUser] = useState(null);
  const [subs, setSubs] = useState([]);
  const navigate = useNavigate();

  // useCallback để tránh warning ESLint
  const fetchUserDetail = useCallback(async () => {
    try {
      const res = await axios.get(API.USER_DETAIL(id));
      setUser(res.data.user);
      setSubs(res.data.subscriptions || []);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết người dùng:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  if (!user) {
    return <p className="text-center mt-5">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <h3>Chi tiết khách hàng</h3>

      <div className="card p-3 mb-4 shadow-sm">
        <p>
          <strong>Tên:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.gmail}
        </p>
        <p>
          <strong>Điện thoại:</strong> {user.phone}
        </p>
        <p>
          <strong>Ngày tạo:</strong>{" "}
          {user.created_at ? new Date(user.created_at).toLocaleString() : "—"}
        </p>
        <p>
          <strong>Trạng thái xác minh:</strong>{" "}
          {user.is_verified ? "Đã xác minh" : "Chưa xác minh"}
        </p>
      </div>

      <h5>Gói đã đăng ký</h5>
      {subs.length === 0 ? (
        <p className="text-muted">Người dùng chưa đăng ký gói nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-info">
              <tr>
                <th>Tên gói</th>
                <th>Giá</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Trạng thái</th>
                <th>Dùng thử</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub.mdk}>
                  <td>{sub.namepk}</td>
                  <td>{sub.gia} VNĐ</td>
                  <td>
                    {sub.startday
                      ? new Date(sub.startday).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    {sub.endday
                      ? new Date(sub.endday).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>{sub.trangthai}</td>
                  <td>{sub.la_goi_dung_thu ? "Có" : "Không"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserDetail;
