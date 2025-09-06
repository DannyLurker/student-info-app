import mongoose, { Schema } from "mongoose";

const studentAttendanceSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Student ID is required"],
      ref: "Student",
      unique: true, // One attendance record per student
    },
    absent: [
      {
        date: {
          type: Date,
          required: [true, "Date is required"],
          validate: {
            validator: function (date: Date) {
              const today = new Date();
              today.setHours(23, 59, 59, 999);
              return date <= today;
            },
            message: "Date cannot be in the future",
          },
        },
        _id: false, // Disable _id for subdocuments
      },
    ],
    permission: [
      {
        date: {
          type: Date,
          required: [true, "Date is required"],
          validate: {
            validator: function (date: Date) {
              const today = new Date();
              today.setHours(23, 59, 59, 999);
              return date <= today;
            },
            message: "Date cannot be in the future",
          },
        },
        description: {
          type: String,
          required: [true, "Permission description is required"],
          minlength: [5, "Description must be at least 5 characters"],
          maxlength: [500, "Description must be at most 500 characters"],
          trim: true,
        },
        _id: false,
      },
    ],
    sick: [
      {
        date: {
          type: Date,
          required: [true, "Date is required"],
          validate: {
            validator: function (date: Date) {
              const today = new Date();
              today.setHours(23, 59, 59, 999);
              return date <= today;
            },
            message: "Date cannot be in the future",
          },
        },
        description: {
          type: String,
          required: [true, "Sick description is required"],
          minlength: [5, "Description must be at least 5 characters"],
          maxlength: [500, "Description must be at most 500 characters"],
          trim: true,
        },

        _id: false,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
studentAttendanceSchema.index({ studentId: 1 });
studentAttendanceSchema.index({ "absent.date": 1 });
studentAttendanceSchema.index({ "permission.date": 1 });
studentAttendanceSchema.index({ "sick.date": 1 });

const studentAttendanceModel = mongoose.model(
  "StudentAttendance",
  studentAttendanceSchema
);

export default studentAttendanceModel;
