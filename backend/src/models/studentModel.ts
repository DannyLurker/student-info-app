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
    homeroomTeacher: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: true }
);

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;
