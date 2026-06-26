import { sendError } from "../utils/response.js";

/**
 * Global Error Handler Middleware
 * Đặt cuối cùng trong index.js, bắt tất cả lỗi được next(error) từ controller
 */
const errorMiddleware = (err, req, res, next) => {
  console.error("❌ [ERROR]:", err.message);

  // Lỗi trùng key unique của Mongoose (ví dụ: email, code đã tồn tại)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 409, `${field} đã tồn tại trong hệ thống.`);
  }

  // Lỗi validation của Mongoose
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 400, "Dữ liệu không hợp lệ.", messages);
  }

  // Lỗi ObjectId không hợp lệ (ví dụ: id sai định dạng)
  if (err.name === "CastError") {
    return sendError(res, 400, `ID không hợp lệ: ${err.value}`);
  }

  // Lỗi mặc định
  return sendError(res, err.statusCode || 500, err.message || "Lỗi máy chủ nội bộ.");
};

export default errorMiddleware;
