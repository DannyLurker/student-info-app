import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import generateOtp from "../../utils/mail/generateOtp.js";
import loadTemplate from "../../utils/mail/loadTemplate.js";
import { sendEmail } from "../../utils/mail/nodeMailer.js";
import staffModel from "../../models/staffModel.js";

export const studentForgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email field must be filled", 400));
  }

  const existingStudent = await studentModel.findOne({ email });

  if (!existingStudent) {
    return next(new AppError("User not found", 404));
  }

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  existingStudent.otp = otp;
  existingStudent.otpExpires = otpExpires;

  await existingStudent.save({ validateBeforeSave: false });

  const htmlTemplate = loadTemplate("emailTemplate.hbs", {
    title: "Reset your password - OTP Verification",
    username: existingStudent.username,
    otp,
    message:
      "Use the following one-time password (OTP) to reset your account password: ",
    link: `/student-reset-password/${existingStudent.id}`,
    time: new Date(),
  });

  try {
    await sendEmail({
      email: existingStudent.email,
      subject: "Reset your password - OTP Verification",
      html: htmlTemplate,
    });

    res.status(200).json({
      status: "Success",
      message: "A new OTP is send to your email",
    });
  } catch (error) {
    existingStudent.otp = null;
    existingStudent.otpExpires = null;
    existingStudent.save({ validateBeforeSave: false });
    return next(
      new AppError("Failed to send OTP email. Please try again later.", 500)
    );
  }
});

export const staffForgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email field must be filled", 400));
  }

  const existingStaff = await staffModel.findOne({ email });

  if (!existingStaff) {
    return next(new AppError("User not found", 404));
  }

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  existingStaff.otp = otp;
  existingStaff.otpExpires = otpExpires;

  await existingStaff.save({ validateBeforeSave: false });

  const htmlTemplate = loadTemplate("emailTemplate.hbs", {
    title: "Reset your password - OTP Verification",
    username: existingStaff.username,
    otp,
    message:
      "Use the following one-time password (OTP) to reset your account password: ",
    link: `/staff-reset-password/${existingStaff.id}`,
    time: new Date(),
  });

  try {
    await sendEmail({
      email: existingStaff.email,
      subject: "Reset your password - OTP Verification",
      html: htmlTemplate,
    });

    res.status(200).json({
      status: "Success",
      message: "A new OTP is send to your email",
    });
  } catch (error) {
    existingStaff.otp = null;
    existingStaff.otpExpires = null;
    existingStaff.save({ validateBeforeSave: false });
    return next(
      new AppError("Failed to send OTP email. Please try again later.", 500)
    );
  }
});
