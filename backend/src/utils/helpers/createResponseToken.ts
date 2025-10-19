import jwtSign from "../../middleware/jwt/jwtSign.js";
import { IResponse } from "../../types/expressTypes.js";
import { IUser } from "../../types/databaseModelTypes.js";

export const createResponseToken = (
  user: IUser,
  statusCode: number,
  res: IResponse,
  message: string
) => {
  const token = jwtSign(user._id.toString(), user.role);
  const cookieOption = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const) //as const disni berguna untuk menginstruksikan TS bahwa nilai merupakan sebuah literal yang spesifik bukan sebagai string biasa. Hal ini penting karena tidak const akan memicu sebuah error message "no overload matches this call". error message disebab kan oleh ketidak sesuain harapan nilai, yang diharapkan adalah sebuah tipe union (yaitu boolean | "none" | "lax" | "strict").
        : ("lax" as const), //Sama kayak di atas
  };

  res.cookie("token", token, cookieOption);
  user.password = undefined;
  user.otp = undefined;
  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user,
    },
  });
};
