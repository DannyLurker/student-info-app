import mongoose, { Document } from "mongoose";

export type SubjectsAvailable =
  | "fundamentals_of_fluency"
  | "english"
  | "civic_education"
  | "math"
  | "religion"
  | "physical_education"
  | "information_technology"
  | "indonesian"
  | "art"
  | "conversation"
  | "history"
  | "fundamentals_of_science_and_social"
  | "mandarin"
  | "ap"
  | "creative_entrepreneurial_products"
  | "pal"
  | "computerized_accounting"
  | "financial_accounting"
  | "banking"
  | "microsoft"
  | "taxation"
  | "web"
  | "database"
  | "oop"
  | "mobile";

// Interface POJO murni (tanpa extend Document)
export interface IStudent {
  _id?: mongoose.Schema.Types.ObjectId | string;
  role: "student";
  username: string;
  email: string;
  password?: string;
  grade: number;
  major: string;
  subjects: SubjectsAvailable[];
  homeroomTeacher: mongoose.Schema.Types.ObjectId | string;
  isActive: boolean;
  otp?: string | null;
  otpExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface IStudentDocument extends Document {
  role: "student";
  username: string;
  email: string;
  password?: string;
  grade: number;
  major: string;
  subjects: SubjectsAvailable[];
  homeroomTeacher: mongoose.Schema.Types.ObjectId | string;
  isActive: boolean;
  otp?: string | null;
  otpExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

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

// -------------------------

export interface IAssessment {
  type: "assignment" | "quiz" | "exam" | "project";
  number: number;
}

export interface IMark {
  _id?: mongoose.Schema.Types.ObjectId | string;
  subject: SubjectsAvailable;
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

// -------------------------

export interface IHomeroomClass {
  grade: 10 | 11 | 12;
  major: "accounting" | "software_engineering";
}

export interface ITeachingGrade {
  grade: 10 | 11 | 12;
  major: "accounting" | "software_engineering";
}

export interface IStaff {
  _id?: mongoose.Schema.Types.ObjectId | string;
  role: string;
  username: string;
  email: string;
  password?: string;
  teachingSubjects: SubjectsAvailable[];
  homeroomClass?: IHomeroomClass;
  teachingGrades: ITeachingGrade[];
  isActive?: boolean;
  otp?: string | null;
  otpExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStaffDocument extends Document {
  role: string;
  username: string;
  email: string;
  password?: string;
  teachingSubjects: SubjectsAvailable[];
  homeroomClass?: IHomeroomClass;
  teachingGrades: ITeachingGrade[];
  isActive?: boolean;
  otp?: string | null;
  otpExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUser = IStudent | IStaff;

export type IUserDocument = IStudentDocument | IStaffDocument;
