import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

// Services
import { authService } from "../services/auth.service";

// Layouts
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";

// Common Components
import ProtectedRoute from "../components/common/ProtectedRoute";

// --- CÁC TRANG CỦA ỨNG DỤNG ---
// Trang công khai
import Home from "../pages/Home";

// Trang xác thực
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Trang quản trị
import Dashboard from "../pages/Admin/Dashboard";
import NavigationManagement from "../pages/Admin/Settings/NavigationManagement";

// Component trang 404
const NotFoundPage = () => (
  <div style={{ padding: "50px", textAlign: "center" }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <Link to="/">
      <button>Go back to Home</button>
    </Link>
  </div>
);

const AppRoutes: React.FC = () => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Routes>
      {/* 
        ============================================================
        Nhóm 1: CÁC TRANG CÔNG KHAI (dùng MainLayout)
        ============================================================
        Bất kỳ ai cũng có thể truy cập.
        Tất cả các route trong nhóm này sẽ được bao bọc bởi Navbar và Footer.
      */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<AboutPage />} />  */}
        {/* <Route path="/contact" element={<ContactPage />} /> */}
      </Route>

      {/* 
        ============================================================
        Nhóm 2: CÁC TRANG XÁC THỰC (không dùng layout chung)
        ============================================================
        Đây là các trang độc lập, toàn màn hình.
        Nếu người dùng đã đăng nhập, sẽ tự động chuyển hướng họ đến dashboard.
      */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      {/* 
        ============================================================
        Nhóm 3: CÁC TRANG QUẢN TRỊ (dùng AdminLayout và được bảo vệ)
        ============================================================
        Yêu cầu người dùng phải đăng nhập.
      */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Các route yêu cầu vai trò 'admin' */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route
              path="/dashboard/settings/navigation"
              element={<NavigationManagement />}
            />
          </Route>
        </Route>
      </Route>

      {/* 
        ============================================================
        Nhóm 4: TRANG NOT FOUND (404)
        ============================================================
        Bắt tất cả các URL không khớp với các route ở trên.
      */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
