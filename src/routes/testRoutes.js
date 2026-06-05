import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly,
  registrarOnly,} from "../middleware/roleMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get(
  "/admin",
  protect,
  adminOnly,
  (req, res) => {
    res.json({
      message:
        "Welcome Admin",
      user: req.user,
    });
  }
);

router.get(
  "/registrar",
  protect,
  registrarOnly,
  (req, res) => {
    res.json({
      message: "Welcome Registrar",
      user: req.user,
    });
  }
);
router.get("/debug-users", async (req, res) => {
  try {
    const users = await User.find(
      {},
      {
        name: 1,
        email: 1,
        role: 1,
        department: 1,
      }
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


export default router;