import { sendError } from "../utils/response.js";

/**
 * Middleware phân quyền theo role
 * Sử dụng sau authMiddleware
 * @param {...string} roles - Các role được phép truy cập
 *
 * Ví dụ dùng trong route:
 *   router.post("/", authMiddleware, roleMiddleware("ADMIN"), controller)
 *   router.get("/", authMiddleware, roleMiddleware("ADMIN", "TEACHER"), controller)
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, "Chưa xác thực. Vui lòng đăng nhập.");
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Bạn không có quyền thực hiện hành động này. Yêu cầu role: ${roles.join(" hoặc ")}.`
      );
    }

    next();
  };
};

export default roleMiddleware;
