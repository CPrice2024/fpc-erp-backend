import express from "express";

import {
  getStudentsForAttendance,
  saveAttendance,
  getAttendanceHistory,
  getTodayAttendance,
} from "../controllers/attendanceController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All attendance routes require login
router.use(protect);

// Teacher's students
router.get(
  "/students",
  getStudentsForAttendance
);

// Save attendance
router.post(
  "/save",
  saveAttendance
);
router.get(
  "/today",
  protect,
  getTodayAttendance
);

// Attendance history
router.get(
  "/history",
  getAttendanceHistory
);

export default router;