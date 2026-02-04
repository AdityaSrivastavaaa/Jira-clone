import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "../../config/env";

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateTokens = (userId: string) => {
  const accessOptions: SignOptions = {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  };

  const refreshOptions: SignOptions = {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  };

  const accessToken = jwt.sign(
    { userId },
    env.JWT_ACCESS_SECRET,
    accessOptions
  );

  const refreshToken = jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    refreshOptions
  );

  return { accessToken, refreshToken };
};
