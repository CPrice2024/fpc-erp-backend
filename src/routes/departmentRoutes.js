import express from "express";
import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  assignDepartmentHead,
  getDepartmentDashboard,
} from "../controllers/departmentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { collegeHeadOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ALL routes require login
router.use(protect);

// 👀 Everyone logged in can view departments (or restrict later)
router.get("/", getDepartments);

// 🔐 ONLY college head can create department
router.post("/", collegeHeadOnly, createDepartment);

// 🔐 ONLY college head can update department
router.put("/:id", collegeHeadOnly, updateDepartment);

// 🔐 ONLY college head can delete department
router.delete("/:id", collegeHeadOnly, deleteDepartment);

// 🔐 ONLY college head can assign department head
router.post("/assign-head", collegeHeadOnly, assignDepartmentHead);

// 🔐 EVERYONE can view their department dashboard
router.get("/dashboard", getDepartmentDashboard);

export default router;