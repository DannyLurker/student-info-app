import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "express-async-handler";
import AppError from "../../utils/error/appError.js";
import staffModel from "../../models/staffModel.js";
import studentModel from "../../models/studentModel.js";

interface IJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

const jwtVerify = catchAsync(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to access", 401)
    );
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as IJwtPayload;
  const userId = decoded.id;
  const userRole = decoded.role;

  let currentUser;

  if (userRole != "student") {
    currentUser = await staffModel.findById(userId);
  } else {
    currentUser = await studentModel.findById(userId);
  }

  if (!currentUser) {
    return next(new AppError("User not found", 404));
  }

  if (!currentUser.isActive) {
    return next(new AppError("User account is inactive", 401));
  }

  (req as any).user = currentUser.toObject();
  next();
});

export default jwtVerify;
