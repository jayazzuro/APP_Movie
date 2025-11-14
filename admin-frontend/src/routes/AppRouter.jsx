import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MovieManagement from "../pages/MovieManagement";
import UserManagement from "../pages/UserManagement";
import PacManagement from "../pages/PacManagement";
import AddMovie from "../pages/AddMovie";
import EditMovie from "../pages/EditMovie";
import UserDetail from "../pages/DetailUser";
import AddPackge from "../pages/AddPackge";
import DashboardLayout from "../layouts/DashboardLayout";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route path="MovieManagement/*" element={<MovieManagement />} />
          <Route path="UserManagement" element={<UserManagement />} />
          <Route path="PacManagement" element={<PacManagement />} />
          <Route path="add-movie" element={<AddMovie />} />
          <Route path="edit-movie/:id" element={<EditMovie />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="detail-user/:id" element={<UserDetail />} />
          <Route path="add-package" element={<AddPackge />} />
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
