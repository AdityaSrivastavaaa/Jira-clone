import { Router } from "express";
import { createProject, getProjectsByOrg } from "./project.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createProject);
router.get("/org/:organizationId", requireAuth, getProjectsByOrg);

export default router;
