import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import { StudentDoc } from "../../types/databaseModelTypes.js";
import { toObjectId } from "../../utils/helpers/toObjectId.js";

export const studentSignupLogic = catchAsync(async (req, res, next) => {
  const {
    username,
    email,
    password,
    confrimPassword,
    grade,
    homeroomTeacher,
    major,
  } = req.body;

  const existingStudent: StudentDoc | null = await studentModel.findOne({
    email,
  });

  if (!username || !email || !password || !confrimPassword) {
    return next(new AppError("All fields must be filled", 400));
  }

  if (password !== confrimPassword) {
    return next(
      new AppError("Password and confirm password must be same", 400)
    );
  }

  if (existingStudent) {
    return next(new AppError("Email already registered", 400));
  }

  const newStudent = await studentModel.create({
    role: "student",
    username,
    email,
    password,
    grade,
    homeroomTeacher: toObjectId(homeroomTeacher),
    major,
  });

  res.status(201).json({
    status: "success",
    data: newStudent.toObject(),
  });
});

export const studentSignupLogicWithExcel = catchAsync(
  async (req, res, next) => {
    // nanti diisi logic import excel
  }
);
