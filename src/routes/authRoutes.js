import express from "express";

import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 PASSWORD RESET ROUTES
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;