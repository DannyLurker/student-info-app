import mongoose, { Schema } from "mongoose";

const studentAttandanceSchema = new Schema({
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
});

const studentAttandanceModel = mongoose.model(
  "StudentAttandance",
  studentAttandanceSchema
);

export default studentAttandanceModel;
