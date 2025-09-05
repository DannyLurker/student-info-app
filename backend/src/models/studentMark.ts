import mongoose, { Schema } from "mongoose";

const studentMarkSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Student ID is required"],
      ref: "Student",
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      match: [/^\d{4}\/\d{4}$/, "Academic year format: YYYY/YYYY"],
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      enum: [1, 2],
    },
    marks: [
      {
        subject: {
          type: String,
          required: [true, "Subject is required"],
          trim: true,
        },
        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Teacher ID is required"],
          ref: "Teacher",
        },
        assessmentType: {
          type: String,
          required: [true, "Assessment type is required"],
          enum: {
            values: ["assignment", "quiz", "exam", "project"],
            message:
              "Assessment type must be: assignment, quiz, exam, or project",
          },
        },
        mark: {
          type: Number,
          required: [true, "Mark is required"],
          min: [0, "Mark must be at least 0"],
          max: [100, "Mark must be at most 100"],
        },
        maxMark: {
          type: Number,
          default: 100,
          min: [1, "Maximum mark must be at least 1"],
        },
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
          maxlength: [200, "Description must be at most 200 characters"],
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

// Compound indexes for efficient queries
studentMarkSchema.index({ studentId: 1, academicYear: 1, semester: 1 });
studentMarkSchema.index({ "marks.subject": 1 });
studentMarkSchema.index({ "marks.teacherId": 1 });
studentMarkSchema.index({ "marks.date": 1 });

// Validation: mark should not exceed maxMark
studentMarkSchema.pre("save", function (next) {
  for (const mark of this.marks) {
    if (mark.mark > mark.maxMark) {
      return next(
        new Error(`Mark ${mark.mark} exceeds maximum mark ${mark.maxMark}`)
      );
    }
  }
  next();
});

const studentMarkModel = mongoose.model("StudentMark", studentMarkSchema);

export default studentMarkModel;
