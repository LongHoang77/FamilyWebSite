import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- THÊM KHỐI SERVER VÀO ĐÂY ---
  server: {
    proxy: {
      // Khi frontend gọi một URL bắt đầu bằng '/api'
      "/api": {
        // Chuyển tiếp yêu cầu đó đến server backend
        target: "http://localhost:5001",
        // Cần thiết cho các virtual host
        changeOrigin: true,
      },
    },
  },
  // ---------------------------------
});
