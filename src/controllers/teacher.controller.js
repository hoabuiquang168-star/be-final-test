import Teacher from "../models/teacher.model.js";
import User from "../models/user.model.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * Tạo mã giáo viên 10 chữ số ngẫu nhiên, đảm bảo unique
 */
const generateUniqueCode = async () => {
  let code;
  let isUnique = false;
  while (!isUnique) {
    // Tạo số từ 0000000000 đến 9999999999
    code = String(Math.floor(Math.random() * 10000000000)).padStart(10, "0");
    const existing = await Teacher.findOne({ code });
    if (!existing) isUnique = true;
  }
  return code;
};

/**
 * GET /api/teachers
 * Danh sách giáo viên với phân trang + populate thông tin user và vị trí
 *
 * Query params:
 *   - page (default: 1)
 *   - limit (default: 10)
 *   - isActive (true/false)
 *   - search (tìm theo tên, email, code)
 */
const getAllTeachers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Xây dựng filter


    // Lấy danh sách với populate
    const [teachers, total] = await Promise.all([
      Teacher.find()
        .populate("userId", "name email phoneNumber address")     // Lấy thông tin user
        .populate("teacherPositionsId", "name code")              // Lấy tên vị trí
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Teacher.countDocuments(),
    ]);

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return sendSuccess(res, 200, "Lấy danh sách giáo viên thành công.", teachers, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/teachers/:id
 * Chi tiết một giáo viên (populate đầy đủ)
 */
const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("userId", "name email phoneNumber address identity dob")
      .populate("teacherPositionsId", "name code des");

    if (!teacher) {
      return sendError(res, 404, "Không tìm thấy giáo viên.");
    }

    return sendSuccess(res, 200, "Lấy thông tin giáo viên thành công.", teacher);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/teachers
 * Tạo giáo viên mới — chỉ ADMIN
 * Body: { name, email, phoneNumber, address, identity, dob, startDate, endDate, teacherPositionsId, degrees }
 */
const createTeacher = async (req, res, next) => {
  try {
    const {
      name, email, phoneNumber, address, identity, dob,
      startDate, endDate, teacherPositionsId, degrees
    } = req.body;

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, "Email đã được sử dụng.");
    }

    // 2. Tạo User mới với role TEACHER
    // Gán mật khẩu ngẫu nhiên hoặc mặc định (VD: Password@123)
    const newUser = await User.create({
      name,
      email,
      password: "Password@123",
      phoneNumber,
      address,
      identity,
      dob,
      role: "TEACHER",
    });

    // 3. Tạo mã code ngẫu nhiên cho giáo viên
    const code = await generateUniqueCode();

    // 4. Tạo Teacher profile gắn với User vừa tạo
    const teacher = await Teacher.create({
      userId: newUser._id,
      code,
      startDate: startDate || new Date(),
      endDate,
      teacherPositionsId: teacherPositionsId || [],
      degrees: degrees || [],
    });

    // 5. Populate trước khi trả về
    await teacher.populate("userId", "name email phoneNumber address identity dob");
    await teacher.populate("teacherPositionsId", "name code");

    return sendSuccess(res, 201, "Tạo hồ sơ giáo viên thành công.", teacher);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/teachers/:id
 * Cập nhật giáo viên — chỉ ADMIN
 */
const updateTeacher = async (req, res, next) => {
  try {
    const { startDate, endDate, teacherPositionsId, degrees, isActive } = req.body;

    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { startDate, endDate, teacherPositionsId, degrees, isActive },
      { new: true, runValidators: true }
    )
      .populate("userId", "name email phoneNumber address")
      .populate("teacherPositionsId", "name code");

    if (!teacher) {
      return sendError(res, 404, "Không tìm thấy giáo viên.");
    }

    return sendSuccess(res, 200, "Cập nhật giáo viên thành công.", teacher);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/teachers/:id
 * Soft delete — chỉ ADMIN (không xóa thật, chỉ đặt isDeleted = true)
 */
const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!teacher) {
      return sendError(res, 404, "Không tìm thấy giáo viên.");
    }

    return sendSuccess(res, 200, "Xóa giáo viên thành công.");
  } catch (error) {
    next(error);
  }
};

export {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
