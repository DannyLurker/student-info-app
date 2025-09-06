import mongoose, { Schema } from "mongoose";

const problemPointSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Student ID is required"],
      ref: "Student",
      unique: true, // One record per student
    },
    problemPoints: [
      {
        point: {
          type: Number,
          required: [true, "Problem point is required"],
          min: [1, "Point must be at least 1"],
          max: [150, "Point cannot exceed 150"],
        },
        description: {
          type: String,
          required: [true, "Description is required"],
          minlength: [10, "Description must be at least 10 characters"],
          maxlength: [500, "Description cannot exceed 500 characters"],
          trim: true,
        },
        category: {
          type: String,
          required: [true, "Category is required"],
          enum: {
            values: ["discipline", "academic", "social", "other"],
            message: "Category must be: discipline, academic, social, or other",
          },
        },
        date: {
          type: Date,
          required: [true, "Incident date is required"],
          validate: {
            validator: function (date: Date) {
              const today = new Date();
              today.setHours(23, 59, 59, 999);
              return date <= today;
            },
            message: "Date cannot be in the future",
          },
        },
        recordedBy: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Recorder is required"],
          ref: "Teacher",
        },
        isResolved: {
          type: Boolean,
          default: false,
        },
        resolvedDate: {
          type: Date,
          validate: {
            validator: function (this: any, date: Date) {
              if (!this.isResolved && date) {
                return false; // Should not have resolvedDate if not resolved
              }
              if (this.isResolved && !date) {
                return false; // Must have resolvedDate if resolved
              }
              return true;
            },
            message: "Resolved date must be consistent with resolution status",
          },
        },
        resolvedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
        },
        resolutionNote: {
          type: String,
          maxlength: [300, "Resolution note cannot exceed 300 characters"],
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

// Indexes
problemPointSchema.index({ studentId: 1 });
problemPointSchema.index({ "problemPoints.date": 1 });
problemPointSchema.index({ "problemPoints.category": 1 });
problemPointSchema.index({ "problemPoints.isResolved": 1 });

const problemPointModel = mongoose.model(
  "StudentProblemPoint",
  problemPointSchema
);

export default problemPointModel;
