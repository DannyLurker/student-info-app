import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import { sendEmail } from "../../utils/mail/nodeMailer.js";
import generateOtp from "../../utils/mail/generateOtp.js";
import loadTemplate from "../../utils/mail/loadTemplate.js";
import bcrypt from "bcryptjs";
import studentModel from "../../models/studentModel.js";
import staffModel from "../../models/staffModel.js";

// Temporary solution Model: any, it should be Model: mongoose.Model<IUserDocument>
const resendEmail = (Model: any, path: string) =>
  catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Email field must be filled", 400));
    }

    const existingUser = await Model.findOne({ email });
    if (!existingUser) return next(new AppError("existingUser not found", 404));

    // Rate limit 1 menit
    if (
      existingUser.otpExpires &&
      (existingUser.otpExpires as Date).getTime() >
        Date.now() + 24 * 60 * 60 * 1000 - 60 * 1000
    ) {
      return next(new AppError("Please wait 1 minute before resending", 429));
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    existingUser.otp = await bcrypt.hash(otp, 10);
    existingUser.otpExpires = otpExpires;
    await existingUser.save({ validateBeforeSave: false });

    const html = loadTemplate("emailTemplate.hbs", {
      title: "Reset your password - OTP Verification",
      username: existingUser.username,
      otp,
      message: "Use this OTP to reset your password:",
      link: `${path}/${existingUser.id}`,
      time: new Date(),
    });

    try {
      await sendEmail({
        email: existingUser.email,
        subject: "Reset your password - OTP Verification",
        html,
      });

      res.status(200).json({
        status: "Success",
        message: "A new OTP has been sent to your email",
      });
    } catch (error) {
      existingUser.otp = null;
      existingUser.otpExpires = null;
      await existingUser.save({ validateBeforeSave: false });
      return next(new AppError("Failed to send OTP email", 500));
    }
  });

export const studentResendEmail = resendEmail(
  studentModel,
  "/student-reset-password"
);
export const staffResendEmail = resendEmail(
  staffModel,
  "/staff-reset-password"
);
