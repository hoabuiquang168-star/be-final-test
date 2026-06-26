import express from "express";
const router = express.Router();
import { register, login, getMe } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

// POST /api/auth/register — Đăng ký (public)
router.post("/register", register);

// POST /api/auth/login — Đăng nhập (public)
router.post("/login", login);

// GET /api/auth/me — Thông tin user hiện tại (cần đăng nhập)
router.get("/me", authMiddleware, getMe);

export default router;
