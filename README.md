# 🎬 APP_Movie – Online Movie Streaming Backend System

## 📌 Overview
APP_Movie is an online movie streaming system designed with a **separated Backend – Frontend – Admin architecture**.  
The project focuses primarily on **backend development**, simulating a real-world system with authentication, data management, real-time features, and payment integration.

The backend is built using **Node.js (Express)** and exposes **RESTful APIs** consumed by both web and mobile clients.

---

## 🏗 System Architecture
- **Backend**: Node.js (Express) – RESTful APIs  
- **Frontend**: Flutter (User), React (Admin Dashboard)  
- **Database**: PostgreSQL  
- **Deployment**: Docker & Docker Compose  

---

## ✨ Core Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected APIs using authentication middleware

### 🎥 Movie Management & Streaming
- Movie listing and search
- Movie detail view
- AI-based movie recommendation

### 💬 Real-time Interaction
- Real-time commenting system using **Socket.IO**
- Live user interactions without page reload

### 💳 Payment Integration
- Integrated **MoMo payment gateway**
- Payment flow handling, callbacks, and transaction status updates

### 🛠 Admin Dashboard
- Movie management (CRUD)
- User management
- Separate Admin interface built with **React**
- Communication with backend via **REST APIs**

---

## 🗄 Database & Deployment
- Designed PostgreSQL database schemas for users, movies, comments, and payments
- Containerized backend and database using **Docker**
- Cloud-ready architecture

---

## 🛠 Technologies Used

### Backend
- Node.js (Express.js)
- RESTful API
- JWT Authentication
- Socket.IO
- Docker, Docker Compose

### Frontend
- Flutter
- React (Admin Dashboard)
- HTML / CSS

### Database
- PostgreSQL

### Tools
- Git & GitHub
- Postman
- Basic CI/CD concepts

---

## 🚀 Run Backend Locally

```bash
# Clone repository
git clone https://github.com/jayazzuro/APP_Movie.git

# Go to backend directory
cd APP_Movie/backend

# Install dependencies
npm install

# Start server
npm run dev
