import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

// GET courses with teacher name
router.get("/", (req, res) => {
  const sql = `
    SELECT c.*, t.name AS teacher_name
    FROM courses c
    LEFT JOIN teachers t ON c.teacher_id = t.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// CREATE course
router.post("/", (req, res) => {
  const { id, name, code, credit, teacherId } = req.body;

  db.query(
    "INSERT INTO courses VALUES (?,?,?,?,?)",
    [id, name, code, credit, teacherId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Course created" });
    }
  );
});

export default router;