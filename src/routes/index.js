import express from "express";
const router = express.Router();

import authRoute from "./auth.route.js";
import teacherRoute from "./teacher.route.js";
import teacherPositionRoute from "./teacherPosition.route.js";

// Gộp tất cả routes vào /api
router.use("/auth", authRoute);
router.use("/teachers", teacherRoute);
router.use("/teacher-positions", teacherPositionRoute);

export default router;
