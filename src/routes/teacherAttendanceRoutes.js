import express from "express";

import {
  getTeachersAttendance,
  markTeacherAttendance,
  getTeacherAttendanceStats,
  getTeacherAttendanceHistory,
} from "../controllers/teacherAttendanceController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  departmentHeadOnly,
} from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ======================================
   GET TEACHERS
====================================== */

router.get(
  "/",
  protect,
  departmentHeadOnly,
  getTeachersAttendance
);

/* ======================================
   SAVE ATTENDANCE
====================================== */

router.post(
  "/",
  protect,
  departmentHeadOnly,
  markTeacherAttendance
);

/* ======================================
   DASHBOARD STATS
====================================== */

router.get(
  "/stats",
  protect,
  departmentHeadOnly,
  getTeacherAttendanceStats
);

/* ======================================
   HISTORY
====================================== */

router.get(
  "/history",
  protect,
  departmentHeadOnly,
  getTeacherAttendanceHistory
);

export default router;