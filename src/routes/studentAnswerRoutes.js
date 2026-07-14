import express from "express";

import {
  saveAnswer,
  getAttemptAnswers,
} from "../controllers/studentAnswerController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveAnswer);

router.get(
  "/attempt/:attemptId",
  protect,
  getAttemptAnswers
);

export default router;