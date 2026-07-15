import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadBook.js";

import {
  uploadBook,
  getCourseBooks,
  deleteBook,
  getBook,
} from "../controllers/digitalBookController.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("book"),
  uploadBook
);

router.get(
  "/course/:courseId",
  protect,
  getCourseBooks
);

router.get(
  "/:id",
  protect,
  getBook
);

router.delete(
  "/:id",
  protect,
  deleteBook
);

export default router;