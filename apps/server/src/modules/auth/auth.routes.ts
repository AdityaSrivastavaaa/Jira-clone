import { Router } from "express";
import { register, login, me } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me); // 👈 ADD THIS

export default router;
