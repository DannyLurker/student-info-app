import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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
      min: [1, "Grade must be at least 1"],
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
