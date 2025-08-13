// backend/src/server.ts

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Import các routes
import authRoutes from "./routes/authRoutes";
import navigationRoutes from "./routes/navigationRoutes";

// 1. TẢI BIẾN MÔI TRƯỜNG MỘT CÁCH ĐÁNG TIN CẬY
// Cấu hình này sẽ tìm file .env ở thư mục gốc của dự án (FamilySite/)
// ngay cả khi script được chạy từ thư mục con /backend
try {
  const envPath = path.resolve(__dirname, "../../.env");
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`✅ Environment variables loaded from: ${envPath}`);
  } else {
    // Trên server production như Render, biến sẽ được nạp sẵn, không cần file .env
    console.log(
      `ℹ️ .env file not found. Using pre-set environment variables (expected on production).`
    );
  }
} catch (error) {
  console.error("❌ Error loading .env file:", error);
}

const app = express();
const PORT = process.env.PORT || 5001;

// 2. CẤU HÌNH MIDDLEWARES

// Cấu hình CORS linh hoạt
if (process.env.NODE_ENV === "production") {
  // Trong production, chỉ cho phép kết nối từ chính domain của nó
  // vì frontend và backend được phục vụ từ cùng một nơi.
  const selfUrl = process.env.RENDER_EXTERNAL_URL; // Render tự cung cấp biến này
  if (selfUrl) {
    console.log(`🔒 Production CORS enabled for: ${selfUrl}`);
    app.use(cors({ origin: selfUrl }));
  } else {
    console.warn(
      "🚨 WARNING: RENDER_EXTERNAL_URL not set. CORS might not work correctly in production."
    );
  }
} else {
  // Trong development, cho phép truy cập từ Vite Dev Server (localhost)
  console.log("🛠️  Development mode: CORS enabled for Vite Dev Server.");
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use(express.json()); // Cho phép server đọc JSON từ body của request

// 3. ĐỊNH NGHĨA API ROUTES
// Các route này phải được định nghĩa TRƯỚC khi phục vụ file tĩnh của frontend
app.use("/api/auth", authRoutes);
app.use("/api/navigation", navigationRoutes);

// 4. PHỤC VỤ CÁC FILE TĨNH CỦA FRONTEND (CHỈ TRONG MÔI TRƯỜNG PRODUCTION)
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

  // Kiểm tra xem thư mục build của frontend có tồn tại không
  if (fs.existsSync(frontendDistPath)) {
    console.log(`📦 Serving frontend static files from: ${frontendDistPath}`);

    // Phục vụ các file tĩnh (CSS, JS, images...) từ thư mục 'dist'
    app.use(express.static(frontendDistPath));

    // Đối với bất kỳ request nào không khớp với API ở trên,
    // trả về file index.html của frontend. Điều này rất quan trọng
    // để React Router có thể xử lý việc điều hướng ở phía client.
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.resolve(frontendDistPath, "index.html"));
    });
  } else {
    console.error(
      `❌ CRITICAL: Frontend build directory not found at: ${frontendDistPath}`
    );
    // Nếu không có frontend, chỉ có API hoạt động
    app.get("/", (req: Request, res: Response) => {
      res
        .status(404)
        .send("API is running, but frontend build is not available.");
    });
  }
} else {
  // Route gốc cho môi trường development để kiểm tra
  app.get("/", (req: Request, res: Response) => {
    res.send("🎉 FamilySite API is running in development mode!");
  });
}

// 5. KẾT NỐI DATABASE VÀ KHỞI CHẠY SERVER
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ MongoDB Connected`);

    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      `❌ Failed to connect to MongoDB and start server:`,
      (error as Error).message
    );
    process.exit(1); // Thoát khỏi tiến trình nếu không kết nối được DB
  }
};

startServer();
