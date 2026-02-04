import { Request, Response } from "express";
import { createOrganization } from "./org.service";
import { prisma } from "../../config/prisma";
export const createOrg = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Organization name required" });
  }

  const org = await createOrganization(name, req.user!.id);
  res.status(201).json(org);
};
export const getMyOrgs = async (req: Request, res: Response) => {
  const userId = req.user!.id; // from requireAuth middleware

  const orgs = await prisma.organizationMember.findMany({
    where: {
      userId,
    },
    include: {
      organization: true,
    },
  });

  res.json(
    orgs.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      role: m.role,
    }))
  );
}