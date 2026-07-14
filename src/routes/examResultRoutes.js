import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {

  getExamResults,

} from "../controllers/examResultController.js";

const router = express.Router();

router.get("/", protect, getExamResults);

export default router;