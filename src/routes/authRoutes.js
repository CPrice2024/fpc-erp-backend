import express from "express";

import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

// If you already have multer configured
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  upload.single("photo"),
  updateProfile
);

router.put(
  "/change-password",
  protect,
  changePassword
);

export default router;