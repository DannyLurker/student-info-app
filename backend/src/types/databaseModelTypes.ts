import mongoose, { HydratedDocument } from "mongoose";

// Interface POJO murni (tanpa extend Document)
export interface IStudent {
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
  subject: string;
  teacherId: mongoose.Schema.Types.ObjectId;
  assessment: IAssessment;
  mark: number;
  maxMark?: number;
  date: Date;
  description?: string;
}

export interface IStudentMark {
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

export interface ITeacher {
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

export type TeacherDoc = HydratedDocument<ITeacher>;
