import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import staffModel from "../../models/staffModel.js";
import mongoose from "mongoose";

export const studentRestPasswordAccount = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return next(new AppError("Invalid or missing id", 400));
  }

  const { otp, password, passwordConfirm } = req.body;

  if (!otp || !password || !passwordConfirm) {
    return next(new AppError("All fields must be filled", 400));
  }

  const existingUser = await studentModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
  });

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  if (!existingUser) {
    return next(new AppError("User not found", 404));
  }

  if (existingUser.otp != otp) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  existingUser.password = password;
  existingUser.otp = null;
  existingUser.otpExpires = null;
  await existingUser.save();

  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully!",
  });
});

export const staffResetPasswordAccount = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return next(new AppError("Invalid or missing id", 400));
  }

  const { otp, password, passwordConfirm } = req.body;

  if (!otp || !password || !passwordConfirm) {
    return next(new AppError("All fields must be filled", 400));
  }

  const objectId = new mongoose.Types.ObjectId(id);

  const existingStaff = await staffModel.findById(objectId);

  if (!existingStaff) {
    return next(new AppError("User not found", 404));
  }

  if (
    existingStaff.otp !== otp ||
    new Date(Date.now()) > existingStaff.otpExpires
  ) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  existingStaff.password = password;
  existingStaff.otp = null;
  existingStaff.otpExpires = null;

  await existingStaff.save();

  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully!",
  });
});
