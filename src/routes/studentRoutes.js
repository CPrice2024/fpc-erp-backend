import express from "express";

import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentCourses,
  getRegistrationSlip,
  getStudentStats,
  getStudentEnrollments,
  getStudentAttendance,
  getActiveStudents,
  getInactiveStudents,
} from "../controllers/studentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { registrarOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createStudent);

router.get("/", protect, getStudents);

router.get("/stats", protect, getStudentStats);

router.get("/active", protect, registrarOnly, getActiveStudents);

router.get("/inactive", protect, registrarOnly, getInactiveStudents);

router.get("/:id/courses", protect, getStudentCourses);

router.get("/:id/enrollments", protect, registrarOnly, getStudentEnrollments);

router.get("/:id/attendance", protect, registrarOnly, getStudentAttendance);

router.get(
  "/:id/registration-slip",
  protect,
  registrarOnly,
  getRegistrationSlip
);

router.get("/:id", protect, getStudent);

router.put("/:id", protect, updateStudent);

router.delete("/:id", protect, deleteStudent);



export default router;