import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import staffModel from "../../models/staffModel.js";
import bcrypt from "bcryptjs";

export const resetStudentPasswordAccount = catchAsync(
  async (req, res, next) => {
    const { otp, email, password, passwordConfirm } = req.body;

    if (!otp || !email || !password || !passwordConfirm) {
      return next(new AppError("All fields must be filled", 400));
    }

    const existingUser = await studentModel.findOne({ email });

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    if (!existingUser) {
      return next(new AppError("User not found", 404));
    }

    if (existingUser.otp !== otp) {
      return next(new AppError("Invalid or expired OTP", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    existingUser.password = hashedPassword;
    existingUser.otp = undefined;
    await existingUser.save();

    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully!",
    });
  }
);

export const resetStaffPasswordAccount = catchAsync(async (req, res, next) => {
  const { otp, email, password, passwordConfirm } = req.body;

  if (!otp || !email || !password || !passwordConfirm) {
    return next(new AppError("All fields must be filled", 400));
  }

  const existingStaff = await staffModel.findOne({ email });

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  if (!existingStaff) {
    return next(new AppError("User not found", 404));
  }

  if (existingStaff.otp !== otp) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  existingStaff.password = hashedPassword;
  existingStaff.otp = undefined;
  await existingStaff.save();

  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully!",
  });
});
