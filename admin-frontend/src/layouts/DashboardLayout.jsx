import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    navigate("/login", { replace: true });
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 bg-primary text-white d-flex flex-column p-3">
          <h3 className="text-center mb-4">Admin Panel</h3>

          <div className="list-group list-group-flush">
            <Link
              to="/dashboard/MovieManagement"
              className="list-group-item list-group-item-action bg-primary text-white border-0"
            >
              Quản lý phim
            </Link>
            <Link
              to="/dashboard/UserManagement"
              className="list-group-item list-group-item-action bg-primary text-white border-0"
            >
              Quản lý khách hàng
            </Link>
            <Link
              to="/dashboard/PacManagement"
              className="list-group-item list-group-item-action bg-primary text-white border-0"
            >
              Quản lý gói dùng
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-danger mt-auto w-100"
          >
            Đăng xuất
          </button>
        </div>

        {/* Main content */}
        <div className="col-12 col-md-9 col-lg-10 bg-light p-4 overflow-auto">
          <Outlet /> {/* Render nội dung trang con */}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
