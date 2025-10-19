import jwt from "jsonwebtoken";

const jwtSign = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "90d",
  });
};

export default jwtSign;
