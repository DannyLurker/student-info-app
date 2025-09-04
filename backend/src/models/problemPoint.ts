import mongoose, { Schema } from "mongoose";

const problemPointSchema = new Schema(
  {
    studentId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    problemPoint: [
      {
        point: {
          type: Number,
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

const problemPointModel = mongoose.model(
  "StudentProblemPoint",
  problemPointSchema
);

export default problemPointModel;
