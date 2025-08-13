import express from "express";
import {
  getNavigationItems, // <-- Dùng hàm hợp nhất này
  getAllNavigationItemsForAdmin,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
} from "../controllers/navigationController";
import { protect } from "../middleware/authMiddleware"; // Middleware bắt buộc đăng nhập
import { authorize } from "../middleware/roleMiddleware";
import { checkAuth } from "../middleware/checkAuthMiddleware"; // <-- Middleware tùy chọn đăng nhập

const router = express.Router();

// @route   GET /api/navigation
// @desc    Get navigation items. Publicly accessible but content varies by role.
// @access  Public / Private
// Sử dụng checkAuth để nó hoạt động cho cả khách và người đã đăng nhập
router.get("/", checkAuth, getNavigationItems);

// --- Routes for Admin Management (Yêu cầu đăng nhập và có vai trò) ---

// @route   GET /api/navigation/all
// @desc    Get ALL navigation items for the management table
// @access  Private (Admin only)
router.get("/all", protect, authorize("admin"), getAllNavigationItemsForAdmin);

// @route   POST /api/navigation
// @desc    Create a new navigation item
// @access  Private (Admin only)
router.post("/", protect, authorize("admin"), createNavigationItem);

// @route   PUT /api/navigation/:id
// @desc    Update a navigation item
// @access  Private (Admin only)
router.put("/:id", protect, authorize("admin"), updateNavigationItem);

// @route   DELETE /api/navigation/:id
// @desc    Delete a navigation item
// @access  Private (Admin only)
router.delete("/:id", protect, authorize("admin"), deleteNavigationItem);

export default router;
