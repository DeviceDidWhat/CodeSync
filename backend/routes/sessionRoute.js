import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireControlAdmin } from "../middleware/requireControlAdmin.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getAllRecordings,
  getMyRecentSessions,
  getSessionById,
  getSessionRecordings,
  joinSession,
} from "../controller/sessionController.js";

const router = express.Router();

router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);

// Admin routes - must be before /:id routes to avoid conflicts
router.get("/admin/all-recordings", protectRoute, requireControlAdmin, getAllRecordings);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);
router.get("/:id/recordings", protectRoute, getSessionRecordings);

export default router;