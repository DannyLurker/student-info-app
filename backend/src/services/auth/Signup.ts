import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import { toObjectId } from "../../utils/helpers/toObjectId.js";
import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";
import {
  IHomeroomClass,
  IStaff,
  IStudent,
  ITeachingGrade,
  SubjectsAvailable,
} from "../../types/databaseModelTypes.js";
import staffModel from "../../models/staffModel.js";
import mongoose from "mongoose";

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

    const newUser = await model.create(body);

    res.status(201).json({
      status: "success",
      message: "Successfully signed up",
      data: newUser,
    });
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

export const excelStudentSignupLogic = catchAsync(async (req, res, next) => {
  const xlsxFile = req.file;
  if (!xlsxFile) return next(new AppError("XLSX file required", 400));

  // If using multer.memoryStorage()
  const workbook = XLSX.read(xlsxFile.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  // Hashing method
  const salt = await bcrypt.genSalt(12);
  async function passwordHashing(plainPassword: string, salt: string) {
    return await bcrypt.hash(plainPassword, salt);
  }

  // Transformasi data Excel ke format schema Mongoose
  const studentsData = await Promise.all(
    jsonData.map(async (data: any) => ({
      role: "student",
      username: data.username,
      email: data.email,
      password: await passwordHashing(data.password, salt),
      grade: data.grade,
      homeroomTeacher: toObjectId(data.homeroomTeacher),
      major: data.major,
    }))
  );

  try {
    const students = await studentModel.insertMany(studentsData, {
      ordered: true,
    });
    res.status(201).json({
      status: "success",
      message: "Successfully signed up",
      count: students.length,
      data: students,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      const match = error.message.match(
        /dup key:\s*\{\s*"?([\w.]+)"?\s*:\s*"([^"]+)"\s*\}/
      );
      const conflictField = match?.[1] || "unknown";
      const conflictValue = match?.[2] || "unknown";

      res.status(409).json({
        status: "fail",
        message: `${conflictField} "${conflictValue}" already exists`,
        field: conflictField,
        value: conflictValue,
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        status: "fail",
        message: "Validation failed",
        errors,
      });
    }
  }
});

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

export const excelStaffSignupLogic = catchAsync(async (req, res, next) => {
  const xlsxFile = req.file;

  if (!xlsxFile) {
    return next(new AppError("XLSX file required", 400));
  }

  // If using multer.memoryStorage()
  const workbook = XLSX.read(xlsxFile.buffer, { type: "buffer" });

  // If using multer.diskStorage()
  // const workbook = XLSX.readFile(xlsxFile.path);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const jsonData = XLSX.utils.sheet_to_json(sheet);

  //Hashing method
  const salt = await bcrypt.genSalt(12);
  async function passwordHashing(plainPassword: string, salt: string) {
    return await bcrypt.hash(plainPassword, salt);
  }

  // Kalau insert banyak data langsung pakai insertMany aja
  const staffsData = await Promise.all(
    jsonData.map(async (data: any) => {
      let subjects = [];
      let grades = [];
      let homeroom = null;

      try {
        if (data.teachingSubjects) {
          const parsed = JSON.parse(data.teachingSubjects);
          subjects = parsed.map((subject: string) => {
            return subject.toLocaleLowerCase().trim();
          });
        }
        if (data.teachingGrades) {
          grades = JSON.parse(data.teachingGrades);
        }
        if (data.homeroomClass) {
          homeroom = JSON.parse(data.homeroomClass);
        }
      } catch (err) {
        console.error("JSON parse error:", err);
      }

      return {
        role: "teacher",
        username: data.username,
        email: data.email,
        password: await passwordHashing(data.password, salt),
        teachingSubjects: subjects,
        homeroomClass: homeroom,
        teachingGrades: grades,
      };
    })
  );

  try {
    const staffs = await staffModel.insertMany(staffsData, { ordered: true });
    res.status(201).json({
      status: "success",
      message: "Successfully signed up",
      staffslength: staffsData.length,
      data: staffs,
    });
  } catch (error) {
    if (error.code === 11000) {
      const match = error.message.match(
        /dup key:\s*\{\s*([\w.]+)\s*:\s*"([^"]+)"\s*\}/
      );
      const conflictField = match?.[1] || "unknown";
      const conflictValue = match?.[2] || "unknown";

      res.status(409).json({
        status: "fail",
        message: `${conflictField} "${conflictValue}" already exists`,
        field: conflictField,
        value: conflictValue,
        error,
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        status: "fail",
        message: "Validation failed",
        errors,
      });
    }
  }
});
