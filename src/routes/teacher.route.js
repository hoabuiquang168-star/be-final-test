import express from "express";
const router = express.Router();
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

// GET /api/teachers?page=1&limit=10&isActive=true
// Tất cả user đã đăng nhập đều xem được danh sách
router.get("/", authMiddleware, getAllTeachers);

// GET /api/teachers/:id — Chi tiết giáo viên
router.get("/:id", authMiddleware, getTeacherById);

// POST /api/teachers — Chỉ ADMIN tạo mới
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createTeacher);

// PUT /api/teachers/:id — Chỉ ADMIN cập nhật
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateTeacher);

// DELETE /api/teachers/:id — Chỉ ADMIN xóa (soft delete)
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteTeacher);

export default router;
