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

const router =
  express.Router();

router.use(protect);

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