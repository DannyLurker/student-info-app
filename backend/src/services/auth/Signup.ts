import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import { toObjectId } from "../../utils/helpers/toObjectId.js";
import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";
import { IStaff, IStudent } from "../../types/databaseModelTypes.js";
import staffModel from "../../models/staffModel.js";

export const manualStudentSignupLogic = catchAsync(async (req, res, next) => {
  const {
    username,
    email,
    password,
    confrimPassword,
    grade,
    homeroomTeacher,
    major,
  } = req.body;

  const existingStudent: IStudent | null = await studentModel.findOne({
    email,
  });

  if (
    !username ||
    !email ||
    !password ||
    !confrimPassword ||
    !grade ||
    !homeroomTeacher ||
    !major
  ) {
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
    message: "Successfully signed up",
    data: {
      newStudent,
    },
  });
});

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

export const manualStaffSignupLogic = catchAsync(async (req, res, next) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    teachingSubjects,
    homeroomClass,
    teachingGrades,
  } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return next(new AppError("All fields must be filled", 400));
  }

  if (password !== confirmPassword) {
    return next(new AppError("Password and confirm password must match", 400));
  }

  const existingStaff: IStaff = await staffModel.findOne({ email });
  if (existingStaff) {
    return next(new AppError("Email already registered", 400));
  }

  const newStaff = await staffModel.create({
    role: "teacher",
    username,
    email,
    password,
    teachingSubjects,
    homeroomClass,
    teachingGrades,
  });

  res.status(201).json({
    status: "success",
    message: "Successfully signed up",
    data: {
      newStaff,
    },
  });
});

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
