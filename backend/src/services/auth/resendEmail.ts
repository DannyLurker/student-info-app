import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import generateOtp from "../../utils/mail/generateOtp.js";
import loadTemplate from "../../utils/mail/loadTemplate.js";
import { sendEmail } from "../../utils/mail/nodeMailer.js";
import staffModel from "../../models/staffModel.js";
import mongoose from "mongoose";

export const studentResendEmail = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("All filled must be filled", 400));
  }

  const objectId = new mongoose.Types.ObjectId(id);

  const existingStudent = await studentModel.findById(objectId);

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

export const staffResendEmail = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("All filled must be filled", 400));
  }

  const objectId = new mongoose.Types.ObjectId(id);

  const existingStudent = await staffModel.findById(objectId);

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
