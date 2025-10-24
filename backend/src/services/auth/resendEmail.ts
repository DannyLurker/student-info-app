import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import { sendEmail } from "../../utils/mail/nodeMailer.js";
import generateOtp from "../../utils/mail/generateOtp.js";
import loadTemplate from "../../utils/mail/loadTemplate.js";
import bcrypt from "bcryptjs";
import studentModel from "../../models/studentModel.js";
import staffModel from "../../models/staffModel.js";

const resendEmail = (Model: any) =>
  catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) return next(new AppError("Email field must be filled", 400));

    const existingUser = await Model.findOne({ email });
    if (!existingUser) return next(new AppError("User not found", 404));

    // Rate limit: tunggu 1 menit sebelum kirim ulang OTP
    if (
      existingUser.otpLastSent &&
      Date.now() - existingUser.otpLastSent.getTime() < 60 * 1000
    ) {
      return next(new AppError("Please wait 1 minute before resending", 429));
    }

    // Batasi 3 kali request OTP per jam
    if (
      existingUser.otpRequestCount >= 3 &&
      Date.now() - existingUser.otpLastSent.getTime() < 60 * 60 * 1000
    ) {
      return next(new AppError("Too many OTP requests. Try again later.", 429));
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

    existingUser.otp = await bcrypt.hash(otp, 12);
    existingUser.otpExpires = otpExpires;
    existingUser.otpLastSent = new Date();
    existingUser.otpRequestCount = (existingUser.otpRequestCount || 0) + 1;

    await existingUser.save({ validateBeforeSave: false });

    const html = loadTemplate("emailTemplate.hbs", {
      title: "Reset your password - OTP Verification",
      username: existingUser.username,
      otp,
      message: "Use this OTP to reset your password:",
      time: new Date().toLocaleString(),
    });

    try {
      await sendEmail({
        email: existingUser.email,
        subject: "Reset your password - OTP Verification",
        html,
      });

      res.status(200).json({
        status: "success",
        message: "A new OTP has been sent to your email",
      });
    } catch (error) {
      existingUser.otp = null;
      existingUser.otpExpires = null;
      await existingUser.save({ validateBeforeSave: false });

      return next(new AppError("Failed to send OTP email", 500));
    }
  });

export const studentResendEmail = resendEmail(studentModel);
export const staffResendEmail = resendEmail(staffModel);
