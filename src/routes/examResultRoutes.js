import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  getExamResults,
  getExamResultById,
} from "../controllers/examResultController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getExamResults
);

router.get(
  "/:attemptId",
  protect,
  getExamResultById
);

export default router;