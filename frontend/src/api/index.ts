import axios from "axios";
import { authService } from "../services/auth.service";
import { message } from "antd";

/**
 * Cấu hình Axios tập trung cho toàn bộ ứng dụng.
 *
 * - Trong môi trường DEVELOPMENT (khi bạn chạy `npm run dev`):
 *   + `baseURL` sẽ là một chuỗi rỗng.
 *   + Mọi yêu cầu API (ví dụ: `/api/auth/login`) sẽ được bắt bởi Vite Proxy
 *     và chuyển tiếp đến backend server (http://localhost:5001).
 *   + Cách này giúp tránh hoàn toàn các vấn đề về CORS khi phát triển.
 *
 * - Trong môi trường PRODUCTION (khi bạn chạy `npm run build`):
 *   + `baseURL` sẽ được lấy từ biến môi trường VITE_API_BASE_URL.
 *   + Khi deploy, chúng ta sẽ đặt biến này thành URL của backend server trên Render.
 *   + Nếu backend và frontend được phục vụ từ cùng một domain, biến này có thể được bỏ trống.
 */

// Lấy base URL từ biến môi trường của Vite.
// `import.meta.env.VITE_API_BASE_URL` là cách Vite truyền biến môi trường vào code.
// Nếu biến không được đặt, nó sẽ là một chuỗi rỗng, phù hợp cho Vite Proxy.
const baseURL = import.meta.env.VITE_API_BASE_URL || "";

console.log(
  `[API Config] Mode: ${import.meta.env.MODE}, Base URL: '${baseURL}'`
);

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor 1: Tự động đính kèm token vào header của mỗi request
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Thường thì lỗi ở đây hiếm khi xảy ra
    console.error("[Request Interceptor Error]", error);
    return Promise.reject(error);
  }
);

// Interceptor 2: Xử lý các lỗi phản hồi từ API một cách tập trung
api.interceptors.response.use(
  // Nếu request thành công (status code 2xx), chỉ cần trả về response
  (response) => response,

  // Nếu request thất bại, xử lý lỗi ở đây
  (error) => {
    // Nếu không có phản hồi từ server (ví dụ: mất mạng, server sập)
    if (!error.response) {
      message.error(
        "Network Error: Could not connect to the server. Please check your connection."
      );
      return Promise.reject(error);
    }

    // Xử lý các lỗi HTTP cụ thể
    const { status } = error.response;

    if (status === 401) {
      // Lỗi 401 Unauthorized: Token không hợp lệ, hết hạn, hoặc chưa đăng nhập.
      console.log("Unauthorized (401). Logging out and redirecting to login.");
      message.error("Your session has expired. Please log in again.");

      authService.logout();

      // Dùng window.location.href để đảm bảo tải lại trang hoàn toàn
      // và xóa sạch mọi trạng thái cũ của ứng dụng.
      window.location.href = "/login";
    } else if (status === 403) {
      // Lỗi 403 Forbidden: Đã đăng nhập nhưng không có quyền truy cập tài nguyên này.
      message.error(
        "Forbidden: You do not have permission to perform this action."
      );
    } else if (status >= 500) {
      // Lỗi 5xx: Lỗi từ phía server
      message.error(
        "Server Error: Something went wrong on our end. Please try again later."
      );
    }

    // Trả về lỗi để các component gọi API có thể xử lý thêm nếu cần (ví dụ: hiển thị thông báo lỗi cụ thể trên form)
    return Promise.reject(error);
  }
);

export default api;
