import jwt from "jsonwebtoken";
import { sendError } from "../utils/response.js";

/**
 * Middleware xác thực JWT
 * Đọc token từ header: Authorization: Bearer <token>
 * Gắn thông tin user vào req.user nếu token hợp lệ
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Không tìm thấy token xác thực. Vui lòng đăng nhập.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn thông tin user vào request để dùng ở các middleware/controller tiếp theo
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Token đã hết hạn. Vui lòng đăng nhập lại.");
    }
    return sendError(res, 401, "Token không hợp lệ.");
  }
};

export default authMiddleware;
