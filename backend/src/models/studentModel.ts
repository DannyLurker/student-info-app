import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    role: {
      type: String,
      default: "student",
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    grade: {
      type: Number,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
    studentAttandance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentAttendance",
    },
    studentMark: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentMark",
      },
    ],
    problemPoint: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentProblemPoint",
      },
    ],
  },
  { timestamps: true, versionKey: true }
);

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;
