import express from "express";
import {
  createProblem,
  getAllProblems,
  getProblemBySlug
} from "../controller/problemController.js";

const router = express.Router();

router.post("/", createProblem);          // create problem
router.get("/", getAllProblems);           // list problems
router.get("/:slug", getProblemBySlug);    // single problem

export default router;
