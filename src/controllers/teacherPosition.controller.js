import TeacherPosition from "../models/teacherPosition.model.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * GET /api/teacher-positions
 * Danh sách tất cả vị trí (chưa bị xóa)
 */
const getAllPositions = async (req, res, next) => {
  try {
    const positions = await TeacherPosition.find();
    return sendSuccess(res, 200, "Lấy danh sách vị trí thành công.", positions);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/teacher-positions/:id
 * Chi tiết một vị trí
 */
const getPositionById = async (req, res, next) => {
  try {
    const position = await TeacherPosition.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (!position) {
      return sendError(res, 404, "Không tìm thấy vị trí công tác.");
    }
    return sendSuccess(res, 200, "Lấy thông tin vị trí thành công.", position);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/teacher-positions
 * Thêm vị trí mới — chỉ ADMIN
 */
const createPosition = async (req, res, next) => {
  try {
    const { name, code, des } = req.body;

    if (!name || !code) {
      return sendError(res, 400, "Tên và mã vị trí là bắt buộc.");
    }

    const existingPosition = await TeacherPosition.findOne({ code });
    if (existingPosition) {
      return sendError(res, 400, "Mã vị trí đã tồn tại.");
    }

    const position = await TeacherPosition.create({ name, code, des });
    return sendSuccess(res, 201, "Tạo vị trí công tác thành công.", position);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/teacher-positions/:id
 * Cập nhật vị trí — chỉ ADMIN
 */
const updatePosition = async (req, res, next) => {
  try {
    const { name, code, des, isActive } = req.body;

    const position = await TeacherPosition.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name, code, des, isActive },
      { new: true, runValidators: true }
    );

    if (!position) {
      return sendError(res, 404, "Không tìm thấy vị trí công tác.");
    }

    return sendSuccess(res, 200, "Cập nhật vị trí thành công.", position);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/teacher-positions/:id
 * Soft delete — chỉ ADMIN
 */
const deletePosition = async (req, res, next) => {
  try {
    const position = await TeacherPosition.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!position) {
      return sendError(res, 404, "Không tìm thấy vị trí công tác.");
    }

    return sendSuccess(res, 200, "Xóa vị trí thành công.");
  } catch (error) {
    next(error);
  }
};

export {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
};
