import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Kết nối Database ──────────────────────────────────────
connectDB();

// ── Global Middlewares ────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────
app.use("/api", routes);

// ── Health check ──────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "Teacher Management API is running 🚀" });
});

// ── Error Handler (phải đặt cuối cùng) ───────────────────
app.use(errorMiddleware);

// ── Start Server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
