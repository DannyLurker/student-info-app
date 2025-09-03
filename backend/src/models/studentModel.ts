import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  role: {
    type: String,
    default: "student",
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  grade: {
    type: Number,
    require: true,
  },
  major: {
    type: String,
    require: true,
  },
  studentAttandance: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "StudentAttandance",
  },
  studentGrades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentGrade",
    },
  ],
  problemPoint: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentGrade",
    },
  ],
});

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;
