import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { IHomeroomClass, ITeachingGrade } from "./databaseModelTypes.js";

interface StudentUser {
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

interface StaffUser {
  role: "admin" | "teacher" | "principal";
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

export type IUser = StudentUser | StaffUser;

export interface IRequest extends Request {
  user: IUser;
}
export interface IResponse extends Response {}
export interface INext extends NextFunction {}
