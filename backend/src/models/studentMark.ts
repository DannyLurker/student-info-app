import mongoose, { Schema } from "mongoose";

const assignmentScheme = new Schema({
  subject: {
    type: String,
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Teacher",
  },
  marks: [
    {
      mark: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

const examScheme = new Schema({
  subject: {
    type: String,
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Teacher",
  },
  marks: [
    {
      mark: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

const studentMarkSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    assignment: [assignmentScheme],
    exam: [examScheme],
  },
  { timestamps: true, versionKey: true }
);

const studentMarkModel = mongoose.model("StudentMark", studentMarkSchema);

export default studentMarkModel;
