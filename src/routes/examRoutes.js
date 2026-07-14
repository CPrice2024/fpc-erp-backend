import express from "express";

import {
  createExam,
  getMyExams,
  getExam,
  updateExam,
  deleteExam,
} from "../controllers/examController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createExam);

router.get("/", getMyExams);

router.get("/:id", getExam);

router.put("/:id", updateExam);

router.delete("/:id", deleteExam);

export default router;