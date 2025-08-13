import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/authRoutes";
import navigationRoutes from "./routes/navigationRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middlewares ---
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Cho phép server đọc JSON từ body của request

// --- Database Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error("An unknown error occurred during DB connection");
    }
    process.exit(1); // Thoát khỏi tiến trình nếu không kết nối được DB
  }
};

connectDB();

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/navigation", navigationRoutes);

// --- Root Route for testing ---
app.get("/", (req: Request, res: Response) => {
  res.send("🎉 FamilySite API is running!");
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
