import constants from "@/constants/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET");
}

export const generateToken = (
  payload: Record<string, any>,
  options?: jwt.SignOptions
) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: constants.tokenExpire,
    ...options,
  });
};

export const verifyToken = <T = any>(token: string) => {
  return jwt.verify(token, JWT_SECRET) as T;
};
