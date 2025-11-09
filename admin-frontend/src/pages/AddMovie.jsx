import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../api/config";

function AddMovie() {
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    TenPhim: "",
    TheLoai: "",
    MoTa: "",
    ThoiLuong: "",
    Video: "",
    Rate: "",
  });
  const [HinhAnh, setHinhAnh] = useState(null);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setHinhAnh(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(movie).forEach((key) => formData.append(key, movie[key]));
      if (HinhAnh) formData.append("HinhAnh", HinhAnh);

      await axios.post(`${API.ADD_MOVIE}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thêm phim thành công");
      navigate("/dashboard/MovieManagement");
    } catch (err) {
      console.error(err);
      alert("Thêm phim thất bại");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Thêm phim mới</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="TenPhim"
          placeholder="Tên phim"
          value={movie.TenPhim}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />
        <input
          type="text"
          name="TheLoai"
          placeholder="Thể loại"
          value={movie.TheLoai}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />
        <textarea
          required
          name="MoTa"
          placeholder="Mô tả"
          value={movie.MoTa}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          required
          type="text"
          name="ThoiLuong"
          placeholder="Thời lượng"
          value={movie.ThoiLuong}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          required
          type="text"
          name="Video"
          placeholder="Link video"
          value={movie.Video}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          required
          type="number"
          name="Rate"
          placeholder="Rate"
          value={movie.Rate}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          required
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">
          Thêm phim
        </button>
      </form>
    </div>
  );
}

export default AddMovie;
