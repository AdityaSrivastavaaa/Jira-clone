import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

export const requireOrgRole =
  (roles: ("OWNER" | "ADMIN" | "MEMBER")[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const orgIdParam = req.params.orgId;

    if (!userId || !orgIdParam) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Ensure orgId is a string
    if (Array.isArray(orgIdParam)) {
      return res.status(400).json({ message: "Invalid organization id" });
    }

    const orgId: string = orgIdParam;

    const membership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: orgId,
        },
      },
    });

    if (!membership || !roles.includes(membership.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };

