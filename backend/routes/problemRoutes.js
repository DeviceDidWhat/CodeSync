import express from "express";
import {
  createProblem,
  getAllProblems,
  getProblemBySlug
} from "../controller/problemController.js";

import { protectRoute } from "../middleware/protectRoute.js";
import { requireControlAdmin } from "../middleware/requireControlAdmin.js";

const router = express.Router();

/* -----------------------
   PUBLIC ROUTES
----------------------- */
router.get("/", getAllProblems);
router.get("/:slug", getProblemBySlug);

/* -----------------------
   ADMIN ONLY
----------------------- */
router.post(
  "/",
  protectRoute,
  requireControlAdmin,
  createProblem
);

export default router;