import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { studentSubjects } from "./studentModel.js";
import validator from "validator";

const staffSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["teacher", "principal", "admin"],
      default: "teacher",
      required: [true, "Role is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [50, "Username must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [8, "Password must be at least 6 characters"],
    },
    teachingSubjects: [
      {
        type: String,
        validate: {
          validator: function (subject: string[]) {
            const { teachingGrades } = this;

            // Ambil semua subject valid dari grade & major yang dia ajar
            const validSubjects = teachingGrades.flatMap(
              (gradeInfo: {
                grade: 10 | 11 | 12;
                major: "accounting" | "software_engineering";
              }) => {
                const subjectsForMajor =
                  studentSubjects[gradeInfo.grade]?.major[gradeInfo.major] ||
                  [];
                return subjectsForMajor;
              }
            );

            return validSubjects.includes(subject);
          },
          message: (props: mongoose.ValidatorProps) =>
            `${props.value} is not a valid subject for assigned grades/majors.`,
        },
      },
    ],
    homeroomClass: {
      grade: {
        type: Number,
        enum: [10, 11, 12],
        required: [true, "Grade is required"],
      },
      major: {
        type: String,
        enum: ["software_engineering", "accounting"],
        required: [true, "Major is required"],
      },
    },
    teachingGrades: [
      {
        grade: {
          type: Number,
          required: [true, "Grade is required"],
          min: [1, "Grade must be at least 1"],
          max: [12, "Grade must be at most 12"],
        },
        major: {
          type: String,
          required: [true, "Major is required"],
          trim: true,
        },
      },
    ],
    otp: {
      type: String,
      default: null,
      select: false,
    },
    otpExpires: {
      type: Date,
      default: null,
      select: false,
    },
    otpLastSent: {
      type: Date,
      default: null,
    },
    otpRequestCount: {
      type: Number,
      default: 0,
    },
    otpRequestResetAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

staffSchema.index({ email: 1 }, { unique: true });
staffSchema.index({ username: 1 }, { unique: true });
staffSchema.index({ teachingSubjects: 1 });
staffSchema.index({ "homeroomClass.grade": 1, "homeroomClass.major": 1 });

staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
staffSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const staffModel = mongoose.model("Staff", staffSchema);

export default staffModel;
