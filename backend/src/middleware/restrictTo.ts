import { INext, IRequest, IResponse } from "../types/expressTypes.js";
import AppError from "../utils/error/appError.js";

type AllowedRoles = "admin" | "teacher" | "principal";

const restrictTo = (...roles: AllowedRoles[]) => {
  return (req: IRequest, res: IResponse, next: INext) => {
    if (
      req.user &&
      req.user.role !== "student" &&
      roles.includes(req.user.role as AllowedRoles)
    ) {
      return next();
    }
    return next(new AppError("You do not have permission", 403));
  };
};

export default restrictTo;
