import express from "express";

import {
  getStudentsForGrades,
  saveGrades,
  getGradeReport,
  getGradeSummary,
} from "../controllers/gradeController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  registrarOnly,
} from "../middleware/roleMiddleware.js";

const router =
  express.Router();

router.use(protect);

router.get(
  "/students",
  getStudentsForGrades
);

router.post(
  "/save",
  saveGrades
);

router.get(
  "/report",
  registrarOnly,
  getGradeReport
);

router.get(
  "/summary",
  registrarOnly,
  getGradeSummary
);

export default router;