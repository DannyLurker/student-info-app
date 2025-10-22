import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import bcrypt from "bcryptjs";
import { createResponseToken } from "../../utils/helpers/createResponseToken.js";
import {
  IHomeroomClass,
  ITeachingGrade,
  SubjectsAvailable,
} from "../../types/databaseModelTypes.js";
import staffModel from "../../models/staffModel.js";

const loginLogic = (model: any) =>
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields must be filled", 400));
    }

    const existingUser = await model
      .findOne({ email })
      .select("+password")
      .lean();

    if (!existingUser) {
      return next(new AppError("User not found", 404));
    }

    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!comparePassword) {
      return next(new AppError("Invalid email or password", 400));
    }

    let userResponse;

    if (existingUser.role == "student") {
      userResponse = {
        ...existingUser,
        _id: existingUser._id.toString(),
        homeroomTeacher: existingUser.homeroomTeacher.toString(),
        subjects: existingUser.subjects as SubjectsAvailable[], //Supaya error Type 'string[]' is not assignable to type 'SubjectsAvailable[]'. Type 'string' is not assignable to type 'SubjectsAvailable'. hilang
      };
    } else {
      userResponse = {
        ...existingUser,
        _id: existingUser._id.toString(),
        teachingGrades: existingUser.teachingGrades as ITeachingGrade[],
        homeroomClass: existingUser.homeroomClass as IHomeroomClass,
        teachingSubjects: existingUser.teachingSubjects as SubjectsAvailable[],
      };
    }

    createResponseToken(
      userResponse,
      200,
      res,
      "You have successfully logged in"
    );
  });

export const studentLoginLogic = loginLogic(studentModel);
export const staffLoginLogic = loginLogic(staffModel);
