import express from "express";

import {
  createQuestion,
  getQuestionsByExam,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Question
router.post("/", protect, createQuestion);

// Get all questions for an exam
router.get("/exam/:examId", protect, getQuestionsByExam);

// Get one question
router.get("/:id", protect, getQuestion);

// Update question
router.put("/:id", protect, updateQuestion);

// Delete question
router.delete("/:id", protect, deleteQuestion);

export default router;