import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";
import {
  IHomeroomClass,
  ITeachingGrade,
  SubjectsAvailable,
} from "../../types/databaseModelTypes.js";
import staffModel from "../../models/staffModel.js";
import mongoose from "mongoose";
import { excelHandlers } from "../../utils/helpers/excelHandlers.js";
import { handleMongooseError } from "../../utils/error/handleMongooseError.js";

type BodyData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  grade: number;
  homeroomTeacher: mongoose.Schema.Types.ObjectId | string;
  major: "software_engineering" | "accounting";
  teachingSubjects: SubjectsAvailable[];
  homeroomClass: IHomeroomClass;
  teachingGrades: ITeachingGrade;
  [key: string]: any;
};

const manualSignupLogic = (model: any, mandatoryFields: string[]) =>
  catchAsync(async (req, res, next) => {
    const {
      username,
      email,
      password,
      confirmPassword,
      grade,
      homeroomTeacher,
      major,
      teachingSubjects,
      homeroomClass,
      teachingGrades,
    } = req.body;

    const body: BodyData = {
      username,
      email,
      password,
      confirmPassword,
      grade,
      homeroomTeacher,
      major,
      teachingSubjects,
      homeroomClass,
      teachingGrades,
    };

    const missingFields = mandatoryFields.filter((field) => {
      const value = body[field];
      if (value === undefined || value === null) return true;
      if (typeof value === "string" && value.trim() === "") return true;
      return false;
    });

    if (missingFields.length > 0) {
      return next(
        new AppError(
          `Missing required fields: ${missingFields.join(", ")}`,
          400
        )
      );
    }

    if (password !== confirmPassword) {
      return next(
        new AppError("Password and confirm password must be same", 400)
      );
    }

    try {
      const newUser = await model.create(body);
      res.status(201).json({
        status: "success",
        message: "Successfully signed up",
        data: newUser,
      });
    } catch (error) {
      handleMongooseError(res, error);
    }
  });

const excelSignupLogic = (model: any, type: "staff" | "student") =>
  catchAsync(async (req, res, next) => {
    const file = req.file;
    if (!file) return next(new AppError("XLSX file required", 400));

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const salt = await bcrypt.genSalt(12);
    const handler = excelHandlers[type];

    const usersData = await Promise.all(jsonData.map((d) => handler(d, salt)));

    try {
      const users = await model.insertMany(usersData, { ordered: true });
      res.status(201).json({
        status: "success",
        message: "Successfully signed up",
        staffslength: users.length,
        data: users,
      });
    } catch (error) {
      handleMongooseError(res, error);
    }
  });

// Student login logic

export const manualStudentSignupLogic = manualSignupLogic(studentModel, [
  "username",
  "email",
  "password",
  "confirmPassword",
  "grade",
  "homeroomTeacher",
  "major",
]);

export const excelStudentSignupLogic = excelSignupLogic(
  studentModel,
  "student"
);

// Staff login logic

export const manualStaffSignupLogic = manualSignupLogic(staffModel, [
  "username",
  "email",
  "password",
  "confirmPassword",
  "teachingSubjects",
  "homeroomClass",
  "teachingGrades",
]);

export const excelStaffSignupLogic = excelSignupLogic(staffModel, "staff");
