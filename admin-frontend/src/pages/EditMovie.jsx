import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API, IMG_URL } from "../api/config";

function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    TenPhim: "",
    TheLoai: "",
    MoTa: "",
    ThoiLuong: "",
    Video: "",
    Rate: "",
    HinhAnh: "",
  });
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`${API.MOVIES}/${id}`);
        setMovie(res.data.movie);
      } catch (err) {
        alert("Không tìm thấy phim");
      }
    };
    fetchMovie();
  }, [id]);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(movie).forEach((key) => formData.append(key, movie[key]));
      if (newImage) formData.append("HinhAnh", newImage);

      await axios.put(API.UPDATE_MOVIE(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Cập nhật phim thành công");
      navigate("/dashboard/MovieManagement");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Sửa phim</h2>
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
          name="MoTa"
          placeholder="Mô tả"
          value={movie.MoTa}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          name="ThoiLuong"
          placeholder="Thời lượng"
          value={movie.ThoiLuong}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          name="Video"
          placeholder="Link video"
          value={movie.Video}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="Rate"
          placeholder="Rate"
          value={movie.Rate}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <div className="mb-2">
          <img
            src={
              newImage ? URL.createObjectURL(newImage) : IMG_URL(movie.HinhAnh)
            }
            alt="movie"
            width="70"
            height="90"
            style={{ objectFit: "cover", borderRadius: "5px" }}
          />
        </div>
        <input
          required
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">
          Cập nhật phim
        </button>
      </form>
    </div>
  );
}

export default EditMovie;
