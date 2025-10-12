import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import bcrypt from "bcryptjs";
import { createResponseToken } from "../../utils/helpers/createResponseToken.js";
import {
  IHomeroomClass,
  IStaff,
  ITeachingGrade,
  SubjectsAvailable,
} from "../../types/databaseModelTypes.js";
import staffModel from "../../models/staffModel.js";

export const studentLoginLogic = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("All fields must be filled", 400));
  }

  const existingStudent = await studentModel
    .findOne({ email })
    .select("+password")
    .lean();

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
    subjects: existingStudent.subjects as SubjectsAvailable[], //Supaya error Type 'string[]' is not assignable to type 'SubjectsAvailable[]'. Type 'string' is not assignable to type 'SubjectsAvailable'. hilang
  };

  createResponseToken(
    userResponse,
    200,
    res,
    "You have successfully logged in"
  );
});

export const staffLoginLogic = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("All fields must be filled", 400));
  }

  const existingStaff = await staffModel
    .findOne({ email })
    .select("+password")
    .lean();

  if (!existingStaff) {
    return next(new AppError("User not found", 404));
  }

  const comparePassword = await bcrypt.compare(
    password,
    existingStaff.password
  );

  if (!comparePassword) {
    return next(new AppError("Invalid email or password", 400));
  }

  const userResponse: IStaff = {
    ...existingStaff,
    _id: existingStaff._id.toString(),
    teachingGrades: existingStaff.teachingGrades as ITeachingGrade[],
    homeroomClass: existingStaff.homeroomClass as IHomeroomClass,
    teachingSubjects: existingStaff.teachingSubjects as SubjectsAvailable[],
  };

  createResponseToken(
    userResponse,
    200,
    res,
    "You have successfully logged in"
  );
});
