import { Error } from "mongoose";
import { IResponse } from "../../types/expressTypes.js";

interface CustomMongooseError extends Error {
  code?: number;
  name: string;
  message: string;
  errors?: Record<string, { message: string }>;
}

export const handleMongooseError = (
  res: IResponse,
  error: CustomMongooseError
) => {
  if (error.code === 11000) {
    const match = error.message.match(
      /dup key:\s*\{\s*([\w.]+)\s*:\s*"([^"]+)"\s*\}/
    );
    const conflictField = match?.[1] || "unknown";
    const conflictValue = match?.[2] || "unknown";
    return res.status(409).json({
      status: "fail",
      message: `${conflictField} "${conflictValue}" already exists`,
      field: conflictField,
      value: conflictValue,
    });
  }

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Unexpected database error",
    error: error.message,
  });
};
