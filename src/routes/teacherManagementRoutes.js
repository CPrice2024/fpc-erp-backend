import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { departmentHeadOnly } from "../middleware/roleMiddleware.js";

import {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  resetTeacherPassword,
  getTeacherStats,
} from "../controllers/teacherManagementController.js";

const router = express.Router();

// All routes require Department Head authentication
router.use(protect, departmentHeadOnly);

// Statistics
router.get("/stats", getTeacherStats);

// Get all teachers
router.get("/", getTeachers);

// Get single teacher
router.get("/:id", getTeacherById);

// Create teacher
router.post("/", createTeacher);

// Update teacher
router.put("/:id", updateTeacher);

// Reset password
router.put("/:id/reset-password", resetTeacherPassword);

// Delete teacher
router.delete("/:id", deleteTeacher);

export default router;