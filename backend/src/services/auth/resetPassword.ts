import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import staffModel from "../../models/staffModel.js";
import bcrypt from "bcryptjs";

const resetPasswordLogic = (model: any) =>
  catchAsync(async (req, res, next) => {
    const { email, otp, password, passwordConfirm } = req.body;

    if (!otp || !password || !email || !passwordConfirm) {
      return next(new AppError("All fields must be filled", 400));
    }

    const existingUser = await model
      .findOne({
        email,
      })
      .select("+otp +otpExpires");

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    if (!existingUser) {
      return next(new AppError("User not found", 404));
    }

    const compare = await bcrypt.compare(otp, existingUser.otp);

    if (!compare) {
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

export const studentRestPasswordAccount = resetPasswordLogic(studentModel);

export const staffResetPasswordAccount = resetPasswordLogic(staffModel);
