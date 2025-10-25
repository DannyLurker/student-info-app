import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

export const studentSubjects = {
  10: {
    major: {
      accounting: [
        "fundamentals_of_fluency",
        "english",
        "civic_education",
        "math",
        "religion",
        "physical_education",
        "information_technology",
        "indonesian",
        "art",
        "conversation",
        "history",
        "fundamentals_of_science_and_social",
        "mandarin",
      ],
      software_engineering: [
        "math",
        "english",
        "mandarin",
        "fundamentals_of_fluency",
        "civic_education",
        "physical_education",
        "religion",
        "history",
        "conversation",
        "indonesian",
        "art",
        "fundamentals_of_science_and_social",
        "information_technology",
      ],
    },
  },
  11: {
    major: {
      accounting: [
        "indonesian",
        "ap",
        "creative_entrepreneurial_products",
        "english",
        "physical_education",
        "history",
        "pal",
        "computerized_accounting",
        "conversation",
        "financial_accounting",
        "religion",
        "math",
        "civic_education",
        "banking",
        "mandarin",
        "microsoft",
        "taxation",
      ],
      software_engineering: [
        "math",
        "english",
        "mandarin",
        "web",
        "database",
        "oop",
        "mobile",
        "civic_education",
        "physical_education",
        "religion",
        "history",
        "conversation",
        "indonesian",
        "creative_entrepreneurial_products",
        "microsoft",
      ],
    },
  },
  12: {
    major: {
      accounting: [
        "ap",
        "computerized_accounting",
        "indonesian",
        "banking",
        "english",
        "civic_education",
        "taxation",
        "financial_accounting",
        "conversation",
        "pal",
        "math",
        "religion",
      ],
      software_engineering: [
        "creative_entrepreneurial_products",
        "oop",
        "database",
        "web",
        "english",
        "mobile",
        "conversation",
        "math",
        "civic_education",
        "religion",
        "indonesian",
      ],
    },
  },
};

const studentSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["student"],
      default: "student",
      required: [true, "Role is required"],
      immutable: true,
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
      minlength: [6, "Password must be at least 6 characters"],
    },
    grade: {
      type: Number,
      required: [true, "Grade is required"],
      min: [10, "Grade must be at least 10"],
      max: [12, "Grade must be at most 12"],
    },
    homeroomTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Homeroom teacher is required"],
      ref: "Teacher",
    },
    major: {
      type: String,
      required: [true, "Major is required"],
      trim: true,
      enum: {
        values: ["accounting", "software_engineering"],
        message: "Major must be either accounting or software engineer",
      },
    },
    subjects: {
      type: [String],
      default: function () {
        return (
          studentSubjects[this.grade as 10 | 11 | 12]?.major[
            this.major as "accounting" | "software_engineering"
          ] || []
        );
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

studentSchema.index({ email: 1 }, { unique: true });
studentSchema.index({ username: 1 }, { unique: true });
studentSchema.index({ grade: 1, major: 1 });
studentSchema.index({ homeroomTeacher: 1 });

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;
