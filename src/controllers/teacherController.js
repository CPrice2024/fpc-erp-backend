

import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";

export const getMyClasses =
async (req, res) => {
  try {
    const classes =
      await Course.find({
        teacher: req.user.id,
      })
        .populate("department", "name")
        .populate("course", "courseName");

    res.json(classes);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAttendanceStudents =
async (req, res) => {
  try {
    const students =
      await Student.find({
        department:
          req.user.department,
      });

    res.json(students);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const saveAttendance =
async (req, res) => {
  try {
    const { records } = req.body;

    await Attendance.insertMany(
      records
    );

    res.json({
      message:
        "Attendance saved",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};