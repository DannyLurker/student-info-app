import { Request, Response, NextFunction } from "express";

interface custromError extends Error {
  statusCode: number;
  status?: string;
  stack?: string;
}

const globalErrorHandler = (
  err: custromError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

export default globalErrorHandler;
