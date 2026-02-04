import { Router } from "express";
import { createIssue, getIssueActivity, getKanbanIssues } from "./issue.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { moveIssue } from "./issue.controller";
import { updateAssignee } from "./issue.controller";
import { addComment, getComments } from "./issue.controller";

const router = Router();

router.post("/", requireAuth, createIssue);
router.get("/project/:projectId", requireAuth, getKanbanIssues);
router.patch("/:id/move", requireAuth, moveIssue);


router.patch("/:id/assignee", requireAuth, updateAssignee);


router.post("/:id/comments", requireAuth, addComment);
router.get("/:id/comments", requireAuth, getComments);
router.get("/:id/activity", requireAuth, getIssueActivity);


export default router;
