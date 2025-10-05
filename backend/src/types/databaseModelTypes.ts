import mongoose, { Document } from "mongoose";

export interface IStudent extends Document {
  role: "student";
  username: string;
  email: string;
  password?: string;
  grade: number;
  major: string;
  subjects: string[];
  homeroomTeacher: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface IStudentAttendance extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  absent: [
    {
      date: Date;
    }
  ];
  permission: [
    {
      date: Date;
      description: string;
    }
  ];
  sick: [
    {
      date: Date;
      description: string;
    }
  ];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

interface IProblemPoint {
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

export interface IStudentProblemPoint extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  problemPoints: IProblemPoint[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

interface IAssessment {
  type: "assignment" | "quiz" | "exam" | "project";
  number: number;
}

interface IMark {
  subject: string;
  teacherId: mongoose.Schema.Types.ObjectId;
  assessment: IAssessment;
  mark: number;
  maxMark?: number;
  date: Date;
  description?: string;
}

export interface IStudentMark extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  academicYear: string;
  semester: 1 | 2;
  marks: IMark[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface IHomeroomClass {
  grade?: number; // optional karena bisa tidak diisi
  major?: string;
}

export interface ITeachingGrade {
  grade: number;
  major: string;
}

export interface ITeacher extends Document {
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
