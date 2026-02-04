import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { createIssueSchema } from "./issue.schema";
import { moveIssueSchema } from "./issue.schema";
import { assignIssueSchema } from "./issue.schema";
import { createCommentSchema } from "./issue.schema";
import { logIssueActivity } from "./activity.service";
export const createIssue = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = createIssueSchema.parse(req.body);

  // 1️⃣ Fetch project + org
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
    include: { organization: true },
  });

  if (!project || project.deletedAt) {
    return res.status(404).json({ message: "Project not found" });
  }

  // 2️⃣ Ensure user is org member
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: project.organizationId,
      },
    },
  });

  if (!membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  // 3️⃣ Compute position (last in BACKLOG)
  const lastIssue = await prisma.issue.findFirst({
    where: {
      projectId: data.projectId,
      status: "BACKLOG",
      deletedAt: null,
    },
    orderBy: { position: "desc" },
  });

  const nextPosition = lastIssue ? lastIssue.position + 1 : 0;

  // 4️⃣ Create issue
  const issue = await prisma.issue.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      status: "BACKLOG",
      position: nextPosition,
      projectId: data.projectId,
      reporterId: userId,
    },
  });
await logIssueActivity({
  issueId: issue.id,
  userId,
  action: "Issue created",
});

  res.status(201).json(issue);
};
export const getKanbanIssues = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const projectId = Array.isArray(req.params.projectId)
    ? req.params.projectId[0]
    : req.params.projectId;

  if (!projectId) {
    return res.status(400).json({ message: "projectId is required" });
  }

  // 1️⃣ Fetch project + org
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.deletedAt) {
    return res.status(404).json({ message: "Project not found" });
  }

  // 2️⃣ Check org membership
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: project.organizationId,
      },
    },
  });

  if (!membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  // 3️⃣ Fetch issues
  const issues = await prisma.issue.findMany({
    where: {
      projectId,
      deletedAt: null,
    },
    orderBy: [
      { status: "asc" },
      { position: "asc" },
    ],
  });

  // 4️⃣ Group by status
  const board = {
    BACKLOG: [],
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  } as Record<string, typeof issues>;

  for (const issue of issues) {
    board[issue.status].push(issue);
  }

  res.json(board);
};


export const moveIssue = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const issueId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!issueId) {
    return res.status(400).json({ message: "Issue id required" });
  }

  const data = moveIssueSchema.parse(req.body);

  // 1️⃣ Fetch issue + project
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue || issue.deletedAt) {
    return res.status(404).json({ message: "Issue not found" });
  }

  // 2️⃣ Ensure org membership
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: issue.project.organizationId,
      },
    },
  });

  if (!membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  const oldStatus = issue.status;
  const oldPosition = issue.position;
  const newStatus = data.status;
  const newPosition = data.newPosition;

  // 3️⃣ Shift positions in target column
  await prisma.issue.updateMany({
    where: {
      projectId: issue.projectId,
      status: newStatus,
      position: { gte: newPosition },
      deletedAt: null,
    },
    data: {
      position: { increment: 1 },
    },
  });

  // 4️⃣ Close gap in source column (if status changed)
  if (oldStatus === newStatus) {
    await prisma.issue.updateMany({
      where: {
        projectId: issue.projectId,
        status: oldStatus,
        position: { gt: oldPosition },
        deletedAt: null,
      },
      data: {
        position: { decrement: 1 },
      },
    });
  } else {
    await prisma.issue.updateMany({
      where: {
        projectId: issue.projectId,
        status: oldStatus,
        position: { gt: oldPosition },
        deletedAt: null,
      },
      data: {
        position: { decrement: 1 },
      },
    });
  }

  // 5️⃣ Move the issue
  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: {
      status: newStatus,
      position: newPosition,
    },
  });
  await logIssueActivity({
  issueId: issueId,
  userId,
  action: `Moved issue to ${newStatus}`,
});


  res.json(updatedIssue);
};



export const updateAssignee = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const issueId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!issueId) {
    return res.status(400).json({ message: "Issue id required" });
  }

  const { assigneeId } = assignIssueSchema.parse(req.body);

  // 1️⃣ Fetch issue + project
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue || issue.deletedAt) {
    return res.status(404).json({ message: "Issue not found" });
  }

  // 2️⃣ Check org membership of requester
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: issue.project.organizationId,
      },
    },
  });

  if (!membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  // 3️⃣ Validate assignee (if provided)
  if (assigneeId) {
    const assigneeMembership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: assigneeId,
          organizationId: issue.project.organizationId,
        },
      },
    });

    if (!assigneeMembership) {
      return res.status(400).json({ message: "Assignee not in organization" });
    }
  }

  // 4️⃣ Update assignee
  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: { assigneeId },
  });
await logIssueActivity({
  issueId: issueId,
  userId,
  action: assigneeId
    ? "Updated assignee"
    : "Unassigned issue",
});

  res.json(updatedIssue);
};



export const addComment = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const issueId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!issueId) {
    return res.status(400).json({ message: "Issue id required" });
  }

  const { content } = createCommentSchema.parse(req.body);

  // 1️⃣ Fetch issue + project
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue || issue.deletedAt) {
    return res.status(404).json({ message: "Issue not found" });
  }

  // 2️⃣ Ensure org membership
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: issue.project.organizationId,
      },
    },
  });

  if (!membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  // 3️⃣ Create comment
  const comment = await prisma.comment.create({
    data: {
      content,
      issueId,
      userId,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  await logIssueActivity({
  issueId,
  userId,
  action: "Added comment",
});


  res.status(201).json(comment);
};

export const getComments = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const issueId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!issueId) {
    return res.status(400).json({ message: "Issue id required" });
  }

  // 1️⃣ Fetch issue + project
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue || issue.deletedAt) {
    return res.status(404).json({ message: "Issue not found" });
  }

  // 2️⃣ Ensure org membership
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: issue.project.organizationId,
      },
    },
  });

  if (!membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  // 3️⃣ Fetch comments
  const comments = await prisma.comment.findMany({
    where: { issueId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  res.json(comments);
};

export const getIssueActivity = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const issueId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!issueId) {
    return res.status(400).json({ message: "Issue id required" });
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue || issue.deletedAt) {
    return res.status(404).json({ message: "Issue not found" });
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: issue.project.organizationId,
      },
    },
  });

  if (!membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  const activities = await prisma.issueActivityLog.findMany({
    where: { issueId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  res.json(activities);
};
