import mongoose from "mongoose";
import dns from "dns";

// Buộc Node.js dùng Google DNS (8.8.8.8) để resolve SRV record của Atlas
// Fix lỗi: querySrv ECONNREFUSED khi mạng nội bộ chặn DNS SRV
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout 10 giây
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Atlas đã kết nối: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    console.log("⏳ Thử kết nối lại sau 5 giây...");
    // Thử lại sau 5 giây thay vì crash server
    setTimeout(connectDB, 5000);
  }
};

// Lắng nghe sự kiện mất kết nối và tự kết nối lại
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB mất kết nối. Đang thử kết nối lại...");
  setTimeout(connectDB, 5000);
});

export default connectDB;
