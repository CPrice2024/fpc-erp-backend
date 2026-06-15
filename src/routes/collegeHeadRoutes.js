import express from "express";

import { getCollegeHeadDashboard } from "../controllers/collegeHeadController.js";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  getCollegeHeadDashboard
);

router.get(
  "/departments",
  protect,
  getDepartments
);

router.post(
  "/departments",
  protect,
  createDepartment
);

router.put(
  "/departments/:id",
  protect,
  updateDepartment
);

router.delete(
  "/departments/:id",
  protect,
  deleteDepartment
);

export default router;