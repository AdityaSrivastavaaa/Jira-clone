import { Router } from "express";
import { createOrg, getMyOrgs } from "./org.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createOrg);
router.get("/", requireAuth, getMyOrgs); // 👈 NEW

export default router;
