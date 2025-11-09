import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Outlet } from "react-router-dom";
import { API, ROUTES, IMG_URL } from "../api/config";

function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      navigate("/login");
      return;
    }
    fetchMovies();
  }, [navigate]);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(API.MOVIES);
      setMovies(res.data.movies || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (idmv) => {
    if (window.confirm("Bạn có chắc muốn xóa phim này không?")) {
      try {
        await axios.delete(API.DELETE_MOVIE(idmv));
        fetchMovies();
      } catch (err) {
        alert("Xóa thất bại");
      }
    }
  };

  return (
    <div className="container-fluid mt-4">
      {" "}
      {/* container-fluid giúp full màn hình */}
      <h2 className="text-center mb-4">Danh sách phim</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate(ROUTES.ADD_MOVIE)}
      >
        + Thêm phim
      </button>
      {movies.length === 0 ? (
        <p className="text-center text-muted">Không có phim nào</p>
      ) : (
        <div className="table-responsive">
          {" "}
          <table className="table table-bordered table-striped text-center align-middle">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Tên phim</th>
                <th>Thể loại</th>
                <th>Mô tả</th>
                <th>Ngày tạo</th>
                <th>Thời lượng</th>
                <th>Ảnh</th>
                <th>Video</th>
                <th>Rate</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {movies.map((movie) => (
                <tr key={movie.idmv}>
                  <td>{movie.idmv}</td>
                  <td style={{ maxWidth: "180px", wordBreak: "break-word" }}>
                    {movie.TenPhim}
                  </td>
                  <td>{movie.TheLoai}</td>
                  <td style={{ maxWidth: "250px", wordBreak: "break-word" }}>
                    {movie.MoTa}
                  </td>
                  <td>{new Date(movie.NgayTao).toLocaleString()}</td>
                  <td>{movie.ThoiLuong}</td>
                  <td>
                    <img
                      src={IMG_URL(movie.HinhAnh)}
                      alt={movie.TenPhim}
                      width="70"
                      height="90"
                      style={{ objectFit: "cover", borderRadius: "5px" }}
                    />
                  </td>
                  <td>
                    <a
                      href={movie.Video}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                  </td>
                  <td>{movie.Rate}</td>

                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate(ROUTES.EDIT_MOVIE(movie.idmv))}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(movie.idmv)}
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
      <Outlet />
    </div>
  );
}

export default MovieManagement;
