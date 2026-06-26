import mongoose from "mongoose";

// Sub-schema cho thông tin học vấn (degrees)
// Khớp với data mẫu: type, school, major, year, isGraduated
const degreeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
    // Ví dụ: "Bachelor", "Master", "Doctorate"
  },
  school: {
    type: String,
    required: true,
    trim: true,
  },
  major: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  isGraduated: {
    type: Boolean,
    default: true,
  },
});

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId là bắt buộc"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      required: [true, "Mã giáo viên là bắt buộc"],
      unique: true,
      trim: true,
      // 10 chữ số ngẫu nhiên, unique — được generate tự động ở controller
    },
    startDate: {
      type: Date,
      required: [true, "Ngày bắt đầu công tác là bắt buộc"],
    },
    endDate: {
      type: Date,
    },
    // Mảng ObjectId tham chiếu đến TeacherPosition
    teacherPositionsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeacherPosition",
      },
    ],
    // Mảng embedded document (không phải collection riêng)
    degrees: [degreeSchema],
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);

export default mongoose.model("Teacher", teacherSchema);
