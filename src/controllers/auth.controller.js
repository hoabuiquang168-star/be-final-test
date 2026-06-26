import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * Tạo JWT token từ thông tin user
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, address, identity, dob, role } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "Email đã được sử dụng.");
    }

    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      address,
      identity,
      dob,
      role: role || "STUDENT",
    });

    const token = generateToken(user);

    return sendSuccess(res, 201, "Đăng ký thành công.", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Đăng nhập, trả về JWT token
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Vui lòng cung cấp email và mật khẩu.");
    }

    // Dùng .select("+password") vì password có select: false trong schema
    const user = await User.findOne({ email, isDeleted: false }).select("+password");
    if (!user) {
      return sendError(res, 401, "Email không đúng.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, "mật khẩu không đúng.");
    }

    const token = generateToken(user);

    return sendSuccess(res, 200, "Đăng nhập thành công.", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại (cần token)
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.isDeleted) {
      return sendError(res, 404, "Không tìm thấy người dùng.");
    }
    return sendSuccess(res, 200, "Lấy thông tin thành công.", user);
  } catch (error) {
    next(error);
  }
};

export { register, login, getMe };
