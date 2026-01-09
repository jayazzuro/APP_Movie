# 🎬 APP_Movie – Hệ thống xem phim trực tuyến

## 📌 Giới thiệu
**APP_Movie** là một hệ thống xem phim trực tuyến được xây dựng theo mô hình **tách riêng Backend – Frontend – Admin**.  
Dự án tập trung vào phát triển **Backend với Node.js (Express)**, mô phỏng một hệ thống thực tế với xác thực người dùng, phân quyền, quản lý dữ liệu và tích hợp frontend.


---

## ✨ Chức năng chính

### 🔐 Xác thực & Phân quyền
- Đăng ký / đăng nhập người dùng
- Xác thực bằng **JWT**
- Phân quyền theo vai trò (**User / Admin**)
- Bảo vệ API bằng middleware

### 🎥 Quản lý & xem phim
- Danh sách phim
- Tìm kiếm phim
- Xem chi tiết phim
- Gợi ý phim (**AI-based recommendation**)

### 🛠 Trang quản trị (Admin)
- Quản lý phim (**CRUD**)
- Quản lý người dùng
- Dashboard riêng cho Admin
- Giao tiếp với Backend thông qua **REST API**

### 🗄 Cơ sở dữ liệu & Triển khai
- Thiết kế CSDL **PostgreSQL**
- Sử dụng **Docker** để triển khai backend và database
- Sẵn sàng cho môi trường cloud

---
## 🛠 Công nghệ sử dụng

### Backend
- Node.js (Express.js)
- RESTful API
- JWT Authentication
- Phân quyền người dùng
- Docker

### Frontend
- Flutter
- React (Admin Dashboard)
- HTML / CSS

### Database
- PostgreSQL

### Công cụ khác
- Git & GitHub
- Postman
- Docker Compose
- CI/CD cơ bản
## 🚀 Hướng dẫn chạy Backend

```bash
# Clone project
git clone https://github.com/jayazzuro/APP_Movie.git

# Vào thư mục backend
cd APP_Movie/backend

# Cài đặt thư viện
npm install

# Chạy server
npm rundev

