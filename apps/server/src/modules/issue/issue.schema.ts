import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  projectId: z.string().uuid(),
  type: z.enum(["BUG", "TASK", "STORY"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});
export const moveIssueSchema = z.object({
  status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
  newPosition: z.number().int().min(0),
});
export const assignIssueSchema = z.object({
  assigneeId: z.string().uuid().nullable(),
});
export const createCommentSchema = z.object({
  content: z.string().min(1).max(5000),
});

