import jwt from "jsonwebtoken";

const jwtSign = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "90d",
  });
};

export default jwtSign;
