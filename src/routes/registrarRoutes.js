import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createRegistrar,
  getRegistrars,
  deleteRegistrar,
  updateRegistrar,
  toggleRegistrarStatus,
} from "../controllers/registrarController.js";

import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentCourses,
} from "../controllers/studentController.js";

import {
  getRegistrarPerformance,
} from "../controllers/registrarPerformanceController.js";


import uploadStudentPhoto
from "../middleware/uploadStudentPhoto.js";

import {
  getRegistrarDashboard,
  getActiveDepartments,
} from "../controllers/registrarDashboardController.js";



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
  uploadStudentPhoto.single(
    "photo"
  ),
  createStudent
);

router.get(
  "/students",
  registrarOnly,
  getStudents
);

router.get(
  "/students/:id",
  registrarOnly,
  getStudent
);

router.get(
  "/students/:id/courses",
  registrarOnly,
  getStudentCourses
);

router.put(
  "/students/:id",
  registrarOnly,
  uploadStudentPhoto.single("photo"),
  updateStudent
);

router.delete(
  "/students/:id",
  registrarOnly,
  deleteStudent
);


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
router.put(
  "/:id",
  collegeHeadOnly,
  updateRegistrar
);
router.put(
  "/toggle-status/:id",
  collegeHeadOnly,
  toggleRegistrarStatus
);

router.get(
  "/performance/:id",
  collegeHeadOnly,
  getRegistrarPerformance
);

export default router;