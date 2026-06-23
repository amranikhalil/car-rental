import { Router } from "express";
import { getStats } from "../controllers/dashboard.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, getStats);

export default router;
