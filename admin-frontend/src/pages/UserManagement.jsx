import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API, ROUTES } from "../api/config";

function CustomerManagement() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API.USERS);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3> Quản lý khách hàng</h3>
      </div>

      {users.length === 0 ? (
        <p className="text-center text-muted">Không có khách hàng nào</p>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-success">
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.idKH}>
                  <td>{u.idKH}</td>
                  <td>{u.name}</td>
                  <td>{u.gmail}</td>
                  <td>{u.phone}</td>
                  <td>
                    {u.is_blocked ? (
                      <span className="badge bg-danger">Đã chặn</span>
                    ) : (
                      <span className="badge bg-success">Hoạt động</span>
                    )}
                  </td>
                  <td>
                    {u.created_at
                      ? new Date(u.created_at).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => navigate(ROUTES.DETAIL_USER(u.idKH))}
                    >
                      Xem chi tiết
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

export default CustomerManagement;
