import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { departmentHeadOnly } from "../middleware/roleMiddleware.js";

import {
  getDepartmentDashboard,
} from "../controllers/departmentDashboardController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  departmentHeadOnly,
  getDepartmentDashboard
);

export default router;