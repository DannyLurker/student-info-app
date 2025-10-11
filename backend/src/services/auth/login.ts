import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import bcrypt from "bcryptjs";
import { createResponseToken } from "../../utils/helpers/createResponseToken.js";

export const studentLoginLogic = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("All fields must be filled", 400));
  }

  const existingStudent = await studentModel.findOne({ email }).lean();

  if (!existingStudent) {
    return next(new AppError("User not found", 404));
  }

  const comparePassword = await bcrypt.compare(
    password,
    existingStudent.password
  );

  if (!comparePassword) {
    return next(new AppError("Invalid email or password", 400));
  }

  const userResponse = {
    ...existingStudent,
    _id: existingStudent._id.toString(),
    homeroomTeacher: existingStudent.homeroomTeacher.toString(),
  };

  createResponseToken(
    userResponse,
    200,
    res,
    "You have successfully logged in"
  );
});
