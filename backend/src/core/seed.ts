// backend/src/core/seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User } from "../models/User";
import { NavigationItem } from "../models/NavigationItem"; // Import model menu

// Cấu hình dotenv để luôn trỏ đúng vào file .env ở thư mục gốc
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    // Nếu đã có kết nối, không cần kết nối lại
    return;
  }
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not defined in your .env file");
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  console.log("✅ MongoDB Connected for Seeding...");
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected.");
};

const seedAdminUser = async () => {
  const adminExists = await User.findOne({ roles: "admin" });
  if (adminExists) {
    console.log("ℹ️ Admin user already exists.");
    return;
  }

  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "❌ Please define ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD in your .env file."
    );
  }

  await User.create({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    roles: ["admin"],
  });

  console.log("✅ Admin user created successfully!");
};

const seedDefaultNavigation = async () => {
  const navCount = await NavigationItem.countDocuments();
  if (navCount > 0) {
    console.log("ℹ️ Navigation items already exist.");
    return;
  }

  const defaultNavItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "DashboardOutlined",
      type: "sidebar",
      roles: ["admin", "moderator"],
      order: 0,
    },
    {
      label: "Nav Settings",
      path: "/dashboard/settings/navigation",
      icon: "SettingOutlined",
      type: "sidebar",
      roles: ["admin"],
      order: 100,
    },
  ];

  await NavigationItem.insertMany(defaultNavItems);
  console.log("✅ Default navigation items created successfully!");
};

// Hàm chính để chạy tất cả các seeder
const runSeeders = async () => {
  try {
    await connectDB();
    await seedAdminUser();
    await seedDefaultNavigation(); // Thêm seeder khác ở đây
  } catch (error) {
    console.error("❌ An error occurred during the seeding process:", error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

runSeeders();
