import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const studentSubjects = {
  10: {
    major: {
      accounting: [
        "Fundamentals of Fluency",
        "English",
        "Civic Education",
        "Math",
        "Religion",
        "Physical Education",
        "Information Technology",
        "Indonesian",
        "Art",
        "Conversation",
        "History",
        "Fundamentals of Science and Social",
        "Mandarin",
      ],
      software_engineering: [
        "Math",
        "English",
        "Mandarin",
        "Fundamentals of Fluency",
        "Civic Education",
        "Physical Education",
        "Religion",
        "History",
        "Conversation",
        "Indonesian",
        "Art",
        "Fundamentals of Science and Social",
        "Information Technology",
      ],
    },
  },
  11: {
    major: {
      accounting: [
        "Indonesian",
        "AP",
        "Creative Entrepreneurial Products",
        "English",
        "Physical Education",
        "History",
        "PAL",
        "Computerized Accounting",
        "Conversation",
        "Financial Accounting",
        "Religion",
        "Math",
        "Civic Education",
        "Banking",
        "Mandarin",
        "Microsoft",
        "Taxation",
      ],
      software_engineering: [
        "Math",
        "English",
        "Mandarin",
        "Web",
        "Database",
        "OOP",
        "Mobile",
        "Civic Education",
        "Physical Education",
        "Religion",
        "History",
        "Conversation",
        "Indonesian",
        "Creative Entrepreneurial Products",
        "Microsoft",
      ],
    },
  },
  12: {
    major: {
      accounting: [
        "AP",
        "Computerized Accounting",
        "Indonesian",
        "Banking",
        "English",
        "Civic Education",
        "Taxation",
        "Financial Accounting",
        "Conversation",
        "PAL",
        "Math",
        "Religion",
      ],
      software_engineering: [
        "Creative Entrepreneurial Products",
        "OOP",
        "Database",
        "Web",
        "English",
        "Mobile",
        "Conversation",
        "Math",
        "Civic Education",
        "Religion",
        "Indonesian",
      ],
    },
  },
};

const studentSchema = new Schema(
  {
    role: {
      type: String,
      default: "student",
      required: [true, "Role is required"],
      immutable: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [50, "Username must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

studentSchema.index({ email: 1 });
studentSchema.index({ username: 1 });
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

studentSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;
