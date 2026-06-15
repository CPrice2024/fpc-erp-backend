

import express from "express";

import {
  getStudentsForGrades,
  saveGrades,
} from "../controllers/gradeController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

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

export default router;