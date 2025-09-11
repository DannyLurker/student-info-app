import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "express-async-handler";
import AppError from "../../utils/appError.js";
import studentModel from "../../models/studentModel.js";

interface IJwtPayload extends JwtPayload {
  id: string;
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

  const currentUser = await studentModel.findById(userId);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does not exist", 401)
    );
  }

  (req as any).user = currentUser.toObject();
  next();
});

export default jwtVerify;
