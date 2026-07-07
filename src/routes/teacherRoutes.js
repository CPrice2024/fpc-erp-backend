import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { teacherOnly } from "../middleware/roleMiddleware.js";

import {
  getTeacherDashboard,
  getMyCourse,
  getMyStudents,
  getStudentProfile,
} from "../controllers/teacherController.js";

const router = express.Router();

router.use(protect, teacherOnly);

router.get("/dashboard", getTeacherDashboard);

router.get("/my-course", getMyCourse);

router.get("/my-students", getMyStudents);

router.get("/student/:id", getStudentProfile);

export default router;