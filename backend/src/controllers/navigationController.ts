import { Response } from "express";
import { NavigationItem } from "../models/NavigationItem";
import { OptionalAuthRequest } from "../middleware/checkAuthMiddleware";
import { AuthenticatedRequest } from "../middleware/authMiddleware"; // Dùng cho các hàm của admin

/**
 * Lấy danh sách menu động, phù hợp cho cả người dùng đã đăng nhập và khách.
 * - Nếu người dùng đã đăng nhập (req.user tồn tại), lọc menu theo vai trò của họ.
 * - Nếu là khách (req.user là undefined), chỉ trả về các mục menu public (có vai trò 'user').
 */
export const getNavigationItems = async (
  req: OptionalAuthRequest,
  res: Response
) => {
  try {
    const { type } = req.query; // Lọc theo type (navbar hoặc sidebar)

    // Xác định vai trò để query:
    // - Nếu có user, lấy các vai trò của họ.
    // - Nếu không có user, mặc định coi như có vai trò 'user' để lấy các mục public.
    const rolesToQuery = req.user ? req.user.roles : ["user"];

    const query: any = {
      roles: { $in: rolesToQuery },
    };
    if (type) {
      query.type = type;
    }

    const accessibleItems = await NavigationItem.find(query)
      .sort({ order: 1 })
      .lean();

    // Hàm đệ quy xây dựng cây menu (giữ nguyên)
    const buildMenuTree = (items: any[], parentId: any = null): any[] => {
      return items
        .filter((item) => String(item.parent) === String(parentId))
        .map((item) => ({
          ...item,
          children: buildMenuTree(items, item._id),
        }));
    };

    const menuTree = buildMenuTree(accessibleItems);

    res.json(menuTree);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// --- CÁC HÀM CRUD CHO ADMIN (giữ nguyên và dùng AuthenticatedRequest) ---

// Lấy tất cả menu items (cho trang quản lý)
export const getAllNavigationItemsForAdmin = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const items = await NavigationItem.find().sort({ order: "asc" });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Tạo mới
export const createNavigationItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const newItem = new NavigationItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({
      message: "Error creating item",
      error: (error as Error).message,
    });
  }
};

// Cập nhật
export const updateNavigationItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const updatedItem = await NavigationItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({
      message: "Error updating item",
      error: (error as Error).message,
    });
  }
};

// Xóa
export const deleteNavigationItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const deletedItem = await NavigationItem.findByIdAndDelete(req.params.id);
    if (!deletedItem)
      return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};
