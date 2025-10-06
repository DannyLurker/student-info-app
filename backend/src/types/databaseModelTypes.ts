import mongoose, { HydratedDocument } from "mongoose";

// Interface POJO murni (tanpa extend Document)
export interface IStudent {
  _id?: mongoose.Schema.Types.ObjectId | string;
  role: "student";
  username: string;
  email: string;
  password?: string;
  grade: number;
  major: string;
  subjects: string[];
  homeroomTeacher: mongoose.Schema.Types.ObjectId | string;
  isActive: boolean;
  otp?: string;
  otpExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

// HydratedDocument type khusus Student
export type StudentDoc = HydratedDocument<IStudent>;

// -------------------------

export interface IStudentAttendance {
  _id?: mongoose.Schema.Types.ObjectId | string;
  studentId: mongoose.Schema.Types.ObjectId;
  absent: { date: Date }[];
  permission: { date: Date; description: string }[];
  sick: { date: Date; description: string }[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export type StudentAttendanceDoc = HydratedDocument<IStudentAttendance>;

// -------------------------

export interface IProblemPoint {
  _id?: mongoose.Schema.Types.ObjectId | string;
  point: number;
  description: string;
  category: "discipline" | "academic" | "social" | "other";
  date: Date;
  recordedBy: mongoose.Schema.Types.ObjectId;
  isResolved: boolean;
  resolvedDate?: Date;
  resolvedBy?: mongoose.Schema.Types.ObjectId;
  resolutionNote?: string;
}

export interface IStudentProblemPoint {
  _id?: mongoose.Schema.Types.ObjectId | string;
  studentId: mongoose.Schema.Types.ObjectId;
  problemPoints: IProblemPoint[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export type StudentProblemPointDoc = HydratedDocument<IStudentProblemPoint>;

// -------------------------

export interface IAssessment {
  type: "assignment" | "quiz" | "exam" | "project";
  number: number;
}

export interface IMark {
  _id?: mongoose.Schema.Types.ObjectId | string;
  subject: string;
  teacherId: mongoose.Schema.Types.ObjectId;
  assessment: IAssessment;
  mark: number;
  maxMark?: number;
  date: Date;
  description?: string;
}

export interface IStudentMark {
  _id?: mongoose.Schema.Types.ObjectId | string;
  studentId: mongoose.Schema.Types.ObjectId;
  academicYear: string;
  semester: 1 | 2;
  marks: IMark[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export type StudentMarkDoc = HydratedDocument<IStudentMark>;

// -------------------------

export interface IHomeroomClass {
  grade?: number;
  major?: string;
}

export interface ITeachingGrade {
  grade: number;
  major: string;
}

export interface IStaff {
  _id?: mongoose.Schema.Types.ObjectId | string;
  role: string;
  username: string;
  email: string;
  password?: string;
  teachingSubjects: string[];
  homeroomClass?: IHomeroomClass;
  teachingGrades: ITeachingGrade[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StaffDoc = HydratedDocument<IStaff>;
