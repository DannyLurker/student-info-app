import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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
    teachingSubjects: {
      type: [String],
      validate: {
        validator: function (subjects: string[]) {
          return subjects.length > 0;
        },
        message: "At least one teaching subject is required",
      },
    },
    homeroomClass: {
      grade: {
        type: Number,
        min: [10, "Grade must be at least 10"],
        max: [12, "Grade must be at most 12"],
      },
      major: {
        type: String,
        trim: true,
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

staffSchema.index({ email: 1 });
staffSchema.index({ username: 1 });
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
