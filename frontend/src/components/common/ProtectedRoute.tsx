import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { message } from "antd";

interface ProtectedRouteProps {
  roles?: string[]; // Các vai trò được phép truy cập
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, chuyển hướng về trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu có yêu cầu về vai trò cụ thể
  if (roles && roles.length > 0) {
    // Kiểm tra xem vai trò của user có nằm trong danh sách được phép không
    const hasRequiredRole = user?.roles.some((role) => roles.includes(role));
    if (!hasRequiredRole) {
      // Nếu không có quyền, có thể chuyển hướng về trang "Forbidden" hoặc trang chủ
      message.error("You do not have permission to access this page.");
      return <Navigate to="/" replace />;
    }
  }

  // Nếu đã đăng nhập và có quyền, cho phép render component con
  return <Outlet />;
};

export default ProtectedRoute;
