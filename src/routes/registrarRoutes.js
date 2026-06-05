import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createRegistrar,
  getRegistrars,
  deleteRegistrar,
} from "../controllers/registrarController.js";

import {
  getRegistrarDashboard,
  getActiveDepartments,
} from "../controllers/registrarDashboardController.js";

import {
  createStudent,
  getStudents,
} from "../controllers/studentController.js";

import {
  collegeHeadOnly,
  registrarOnly,
} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

/* Registrar Dashboard */
router.get(
  "/dashboard",
  registrarOnly,
  getRegistrarDashboard
);

/* Active Departments */
router.get(
  "/departments",
  registrarOnly,
  getActiveDepartments
);

/* Student Management */
router.post(
  "/students",
  registrarOnly,
  createStudent
);

router.get(
  "/students",
  registrarOnly,
  getStudents
);

/* Registrar Management (College Head Only) */
router.get(
  "/",
  collegeHeadOnly,
  getRegistrars
);

router.post(
  "/",
  collegeHeadOnly,
  createRegistrar
);

router.delete(
  "/:id",
  collegeHeadOnly,
  deleteRegistrar
);

export default router;