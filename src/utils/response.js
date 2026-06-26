/**
 * Tiện ích tạo response chuẩn cho toàn bộ API
 * Dùng nhất quán ở tất cả controller để frontend dễ xử lý
 */

const sendSuccess = (res, statusCode = 200, message = "Thành công", data = null, pagination = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  if (pagination !== null) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = "Đã có lỗi xảy ra", errors = null) => {
  const response = { success: false, message };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

export { sendSuccess, sendError };
