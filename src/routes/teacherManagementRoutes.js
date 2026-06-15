import express from "express";

import { protect }
from "../middleware/authMiddleware.js";

import {
  departmentHeadOnly,
} from "../middleware/roleMiddleware.js";

import {
  createTeacher,
  getTeachers,
  deleteTeacher,
} from "../controllers/teacherManagementController.js";
import {
  getMyClasses,
  getAttendanceStudents,
  saveAttendance,
}
from "../controllers/teacherController.js";

const router =
  express.Router();

router.use(protect);


router.get(
  "/my-classes",
  getMyClasses
);

router.get(
  "/attendance-students",
  getAttendanceStudents
);

router.post(
  "/attendance",
  saveAttendance
);

router.get(
  "/",
  departmentHeadOnly,
  getTeachers
);

router.post(
  "/",
  departmentHeadOnly,
  createTeacher
);

router.delete(
  "/:id",
  departmentHeadOnly,
  deleteTeacher
);

export default router;