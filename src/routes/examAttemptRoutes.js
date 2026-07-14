import express from "express";

import {
  startExam,
  getExamAttempt,
  submitExam,
  getStudentHistory,
} from "../controllers/examAttemptController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startExam);

router.get("/:id", protect, getExamAttempt);

router.put("/:id/submit", protect, submitExam);

router.get(
  "/student/:studentId",
  protect,
  getStudentHistory
);

export default router;