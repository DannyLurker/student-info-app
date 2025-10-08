import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import studentModel from "../../models/studentModel.js";
import { StudentDoc } from "../../types/databaseModelTypes.js";
import { toObjectId } from "../../utils/helpers/toObjectId.js";
import * as XLSX from "xlsx";

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

export const excelStudentSignupLogic = catchAsync(async (req, res, next) => {
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

  // Kalau insert banyak data langsung pakai insertMany aja
  const students = await studentModel.insertMany(
    jsonData.map((data: any) => ({
      role: "student",
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      grade: data.grade,
      homeroomTeacher: toObjectId(data.homeroomTeacher),
      major: data.major,
    }))
  );

  res.status(201).json({
    status: "success",
    count: students.length,
    data: students,
  });
});
