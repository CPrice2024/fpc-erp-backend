import express from "express";

import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentCourses,
  getStudentStats,
} from "../controllers/studentController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createStudent
);

router.get(
  "/",
  protect,
  getStudents
);
router.get(
  "/stats",
  protect,
  getStudentStats
);
router.get(
  "/:id/courses",
  protect,
  getStudentCourses
);

router.get(
  "/:id",
  protect,
  getStudent
);

router.put(
  "/:id",
  protect,
  updateStudent
);

router.delete(
  "/:id",
  protect,
  deleteStudent
);

export default router;