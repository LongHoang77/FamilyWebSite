// src/api/index.ts
import axios from "axios";
import { authService } from "../services/auth.service";

const api = axios.create({
  baseURL: "/api", // Đảm bảo cổng này khớp với backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      authService.logout();
      // Tải lại trang để xóa trạng thái và chuyển hướng
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
