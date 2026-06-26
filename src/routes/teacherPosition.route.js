import express from "express";
const router = express.Router();
import {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
} from "../controllers/teacherPosition.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

// GET /api/teacher-positions — Tất cả user đã đăng nhập đều xem được
router.get("/", authMiddleware, getAllPositions);

// GET /api/teacher-positions/:id
router.get("/:id", authMiddleware, getPositionById);

// POST /api/teacher-positions — Chỉ ADMIN
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createPosition);

// PUT /api/teacher-positions/:id — Chỉ ADMIN
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updatePosition);

// DELETE /api/teacher-positions/:id — Chỉ ADMIN
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deletePosition);

export default router;
