import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.schema";
import {
  hashPassword,
  comparePassword,
  generateTokens,
} from "./auth.service";
import { prisma } from "../../config/prisma";

/**
 * REGISTER
 */
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
    secure: true,        // REQUIRED (Render is HTTPS)
    sameSite: "none",    // REQUIRED for cross-site
    path: "/",
  })
  .cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  })
  .status(201) // only in register
  .json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
};

/**
 * LOGIN
 */
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
    secure: true,        // REQUIRED (Render is HTTPS)
    sameSite: "none",    // REQUIRED for cross-site
    path: "/",
  })
  .cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  })
  .status(201) // only in register
  .json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
};

/**
 * ME (SESSION RESTORE)
 * GET /api/v1/auth/me
 */
export const me = async (req: Request, res: Response) => {
  /**
   * requireAuth middleware attaches user like:
   * (req as any).user
   */
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
};
