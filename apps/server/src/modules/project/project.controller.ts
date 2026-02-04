import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { createProjectSchema } from "./project.schema";
import { OrgRole } from "../../../prisma/generated/prisma";


/**
 * CREATE PROJECT
 * Only OWNER or ADMIN can create
 */
export const createProject = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = createProjectSchema.parse(req.body);

  // 1️⃣ Check org membership
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: data.organizationId,
      },
    },
  });

  if (!membership) {
    return res.status(403).json({ message: "Not a member of this organization" });
  }

  // 2️⃣ Role check
  if (membership.role === OrgRole.MEMBER) {
    return res.status(403).json({ message: "Insufficient permissions" });
  }

  // 3️⃣ Create project
  const project = await prisma.project.create({
    data: {
      name: data.name,
      key: data.key,
      organizationId: data.organizationId,
    },
  });

  res.status(201).json(project);
};

/**
 * GET PROJECTS BY ORGANIZATION
 */
export const getProjectsByOrg = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const organizationId = Array.isArray(req.params.organizationId)
    ? req.params.organizationId[0]
    : req.params.organizationId;

  // 1️⃣ Ensure membership
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  // 2️⃣ Fetch projects
  const projects = await prisma.project.findMany({
    where: {
      organizationId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.json(projects);
};
