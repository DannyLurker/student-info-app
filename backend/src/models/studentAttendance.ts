import mongoose, { Schema } from "mongoose";

const studentAttendanceSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    unexcusedAbsence: [
      {
        type: Date,
        required: true,
      },
    ],
    permission: [
      {
        date: {
          type: Date,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    sick: [
      {
        date: {
          type: Date,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true, versionKey: true }
);

const studentAttendanceModel = mongoose.model(
  "studentAttendance",
  studentAttendanceSchema
);

export default studentAttendanceModel;
