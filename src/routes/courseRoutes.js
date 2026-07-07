import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";

import { protect }
from "../middleware/authMiddleware.js";

import {
  departmentHeadOnly,
} from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ==========================
   GET ALL COURSES
========================== */
router.get(
  "/",
  protect,
  async (req, res) => {
    try {

      const query = {};

      if (
        req.user.role ===
        "department_head"
      ) {
        query.department =
          req.user.department;
      }

      const courses =
        await Course.find(query)
          .populate(
            "department",
            "name"
          )
          .populate(
            "teacher",
            "name email"
          );

      res.json(courses);

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

/* ==========================
   CREATE COURSE
========================== */
router.post(
  "/",
  protect,
  departmentHeadOnly,
  async (req, res) => {
    try {

      const {
  courseCode,
  courseName,
  level,
  semester,
  section,
  creditHour,
  status,
} = req.body;

      const exists =
        await Course.findOne({
          courseCode,
        });

      if (exists) {
        return res.status(400).json({
          message:
            "Course code already exists",
        });
      }

      const course = await Course.create({
  courseCode,
  courseName,
  level,
  semester,
  section,
  creditHour,
  status,
  department: req.user.department,
});

      res.status(201).json({
        message:
          "Course created successfully",

        course,
      });

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

/* ==========================
   ASSIGN TEACHER
========================== */
router.put(
  "/assign-teacher/:id",
  protect,
  departmentHeadOnly,
  async (req, res) => {
    try {
      const { teacherId } = req.body;

      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      const teacher = await User.findById(teacherId);

      if (!teacher || teacher.role !== "teacher") {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      // Update Course
      course.teacher = teacher._id;
      await course.save();

      // Update Teacher
      teacher.course = course._id;
      await teacher.save();

      const updatedCourse = await Course.findById(course._id)
        .populate("teacher", "name email")
        .populate("department", "name");

      res.json({
        message: "Teacher assigned successfully",
        course: updatedCourse,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/* ==========================
   COURSE STATISTICS
========================== */
router.get(
  "/stats",
  protect,
  async (req, res) => {
    try {

      const filter = {};

      if (req.user.role === "department_head") {
        filter.department = req.user.department;
      }

      const totalCourses =
        await Course.countDocuments(filter);

      const assignedCourses =
        await Course.countDocuments({
          ...filter,
          teacher: { $ne: null },
        });

      const unassignedCourses =
        totalCourses - assignedCourses;

      res.json({
        totalCourses,
        assignedCourses,
        unassignedCourses,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {

      const course =
        await Course.findById(
          req.params.id
        )
          .populate(
            "department",
            "name"
          )
          .populate(
            "teacher",
            "name email"
          );

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      res.json(course);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.put(
  "/:id",
  protect,
  departmentHeadOnly,
  async (req, res) => {
    try {

      const {
        courseName,
        level,
        creditHour,
        status,
      } = req.body;

      const course =
        await Course.findByIdAndUpdate(
          req.params.id,
          {
            courseName,
            level,
            creditHour,
            status,
          },
          {
            new: true,
          }
        )
          .populate(
            "department",
            "name"
          )
          .populate(
            "teacher",
            "name email"
          );

      res.json(course);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/* ==========================
   DELETE COURSE
========================== */
router.delete(
  "/:id",
  protect,
  departmentHeadOnly,
  async (req, res) => {
    try {

      await Course.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Course deleted successfully",
      });

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

export default router;