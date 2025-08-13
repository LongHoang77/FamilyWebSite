// backend/src/middleware/checkAuthMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

// Mở rộng kiểu Request của Express để có thể chứa thông tin user (hoặc là undefined)
export interface OptionalAuthRequest extends Request {
  user?: IUser;
}

/**
 * Middleware để kiểm tra và xác thực token JWT nếu có.
 * Nếu token hợp lệ, req.user sẽ được gắn thông tin người dùng.
 * Nếu không có token hoặc token không hợp lệ, nó sẽ bỏ qua và tiếp tục mà không báo lỗi.
 * req.user sẽ là undefined trong trường hợp này.
 */
export const checkAuth = async (
  req: OptionalAuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Nếu token không hợp lệ, không cần làm gì, cứ để req.user là undefined
      console.log("Invalid token provided, proceeding as guest.");
    }
  }

  // Luôn luôn tiếp tục đến middleware/controller tiếp theo
  next();
};
