import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCollegeReports }
from "../controllers/reportController.js";

const router = express.Router();

router.get(
  "/college-head",
  protect,
  getCollegeReports
);

export default router;