import mongoose from "mongoose";

const teacherPositionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên vị trí là bắt buộc"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Mã vị trí là bắt buộc"],
      unique: true,
      trim: true,
    },
    des: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TeacherPosition", teacherPositionSchema);
