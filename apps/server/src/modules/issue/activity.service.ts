import { prisma } from "../../config/prisma";

export const logIssueActivity = async ({
  issueId,
  userId,
  action,
}: {
  issueId: string;
  userId: string;
  action: string;
}) => {
  await prisma.issueActivityLog.create({
    data: {
      issueId,
      userId,
      action,
    },
  });
};
