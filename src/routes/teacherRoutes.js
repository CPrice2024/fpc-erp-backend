import express from "express";
import Teacher from "../models/Teacher.js";


const router = express.Router();


// ===============================
// GET ALL TEACHERS
// ===============================
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .sort({ createdAt: -1 });

    res.json(teachers);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ===============================
// GET SINGLE TEACHER
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(
      req.params.id
    );

    res.json(teacher);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ===============================
// CREATE TEACHER
// ===============================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      experience,
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !specialization ||
      !experience
    ) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // Existing email
    const existingTeacher =
      await Teacher.findOne({ email });

    if (existingTeacher) {
      return res.status(400).json({
        message: "Teacher already exists",
      });
    }

    // Create
    const teacher = await Teacher.create({
      name,
      email,
      specialization,
      experience,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ===============================
// UPDATE TEACHER
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const updatedTeacher =
      await Teacher.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json({
      success: true,
      message: "Updated successfully",
      updatedTeacher,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ===============================
// DELETE TEACHER
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;