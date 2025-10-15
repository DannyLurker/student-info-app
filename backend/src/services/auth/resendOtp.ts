import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import generateOtp from "../../utils/mail/generateOtp.js";

export const resendStudentOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email filled must be filled", 400));
  }

  const existingStudent = await studentModel.findOne(email);

  if (existingStudent) {
    return next(new AppError("User not found", 404));
  }

  const otp = generateOtp();
  const otpExpires = Date.now() + 24 * 60 * 60 * 1000;
});
