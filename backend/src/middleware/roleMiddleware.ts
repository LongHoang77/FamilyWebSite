import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";

// Middleware factory: tạo ra một middleware để kiểm tra vai trò
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    // Kiểm tra xem trong mảng vai trò của user, có vai trò nào nằm trong danh sách vai trò được phép không
    if (!req.user.roles.some((role) => roles.includes(role))) {
      return res.status(403).json({
        message:
          "Forbidden: You do not have permission to access this resource",
      });
    }
    next();
  };
};
