import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import generateOtp from "../../utils/mail/generateOtp.js";
import loadTemplate from "../../utils/mail/loadTemplate.js";
import { sendEmail } from "../../utils/mail/nodeMailer.js";
import staffModel from "../../models/staffModel.js";
import bcrypt from "bcryptjs";

const forgetPasswordLogic = (model: any) =>
  catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Email field must be filled", 400));
    }

    const existingUser = await model
      .findOne({ email })
      .select("+otp +otpExpires");

    if (!existingUser) {
      return next(new AppError("User not found", 404));
    }

    if (
      existingUser.otpLastSent &&
      Date.now() - existingUser.otpLastSent.getTime() < 60 * 1000
    ) {
      return next(new AppError("Please wait 1 minute before resending", 429));
    }

    if (
      !existingUser.otpRequestResetAt ||
      existingUser.otpRequestResetAt < new Date()
    ) {
      existingUser.otpRequestCount = 0;
      existingUser.otpRequestResetAt = new Date(
        Date.now() + 1 * 60 * 60 * 1000
      );
    }

    existingUser.otpRequestCount = (existingUser.otpRequestCount || 0) + 1;

    // Batasi 3 kali request OTP per jam
    if (existingUser.otpRequestCount > 3) {
      return next(
        new AppError(
          "Too many OTP requests. Try again later. Wait for an hour",
          429
        )
      );
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

    existingUser.otp = await bcrypt.hash(otp, 12);
    existingUser.otpExpires = otpExpires;

    await existingUser.save({ validateBeforeSave: false });

    const htmlTemplate = loadTemplate("emailTemplate.hbs", {
      title: "Reset your password - OTP Verification",
      username: existingUser.username,
      otp,
      message:
        "Use the following one-time password (OTP) to reset your account password: ",
      time: new Date().toLocaleString(),
    });

    try {
      await sendEmail({
        email: existingUser.email,
        subject: "Reset your password - OTP Verification",
        html: htmlTemplate,
      });

      res.status(200).json({
        status: "success",
        message: "A new OTP is send to your email",
      });
    } catch (error) {
      existingUser.otp = null;
      existingUser.otpExpires = null;
      existingUser.save({ validateBeforeSave: false });
      return next(
        new AppError("Failed to send OTP email. Please try again later.", 500)
      );
    }
  });

export const studentForgetPasswordLogic = forgetPasswordLogic(studentModel);
export const staffForgetPasswordLogic = forgetPasswordLogic(staffModel);
