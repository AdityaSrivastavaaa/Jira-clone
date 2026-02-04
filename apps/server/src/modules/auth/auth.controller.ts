import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.schema";
import {
  hashPassword,
  comparePassword,
  generateTokens,
} from "./auth.service";
import { prisma } from "../../config/prisma";



export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
   

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });

  const tokens = generateTokens(user.id);

  res
    .cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .status(201)
    .json({ user: { id: user.id, email: user.email, name: user.name } });
};

export const login = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

 

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await comparePassword(data.password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const tokens = generateTokens(user.id);

  res
    .cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .json({ user: { id: user.id, email: user.email, name: user.name } });
};

