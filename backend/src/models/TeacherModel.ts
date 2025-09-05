import mongoose, { Schema } from "mongoose";

const teacherSchema = new Schema(
  {
    role: {
      type: String,
      default: "teacher",
      required: true,
      immutable: true,
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
    teachingSubjects: [String],
    homeroomClass: {
      type: String,
    },
    teachingGrades: [
      {
        grade: {
          type: Number,
          required: true,
        },
        major: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true, versionKey: true }
);

const teacherModel = mongoose.model("Teacher", teacherSchema);

export default teacherModel;
