
import { prisma } from "../../config/prisma";

export const createOrganization = async (name: string, userId: string) => {

  return prisma.organization.create({
    data: {
      name,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });
};
