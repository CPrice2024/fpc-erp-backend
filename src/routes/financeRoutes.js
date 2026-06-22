import express from "express";

import {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
  getFinanceDashboard,
  getFinanceStats,
  getStudentPayments,
  getMonthlyRevenue,
  getReceipt,
  getDepartmentRevenue,
} from "../controllers/financeController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  registrarOnly,
} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  registrarOnly,
  createPayment
);

router.get(
  "/",
  registrarOnly,
  getPayments
);
router.get(
  "/receipt/:receiptNumber",
  registrarOnly,
  getReceipt
);

router.get(
  "/monthly-revenue",
  registrarOnly,
  getMonthlyRevenue
);

router.get(
  "/dashboard",
  registrarOnly,
  getFinanceDashboard
);

router.get(
  "/stats",
  registrarOnly,
  getFinanceStats
);

router.get(
  "/student/:studentId",
  registrarOnly,
  getStudentPayments
);
router.get(
  "/department-revenue",
  registrarOnly,
  getDepartmentRevenue
);

router.get(
  "/:id",
  registrarOnly,
  getPayment
);

router.put(
  "/:id",
  registrarOnly,
  updatePayment
);

router.delete(
  "/:id",
  registrarOnly,
  deletePayment
);

export default router;
