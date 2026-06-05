import Student from "../models/Student.js";
import Department from "../models/Department.js";
import User from "../models/User.js";

export const getRegistrarDashboard =
async (req, res) => {
  try {
    const totalStudents =
      await Student.countDocuments();

    const totalDepartments =
      await Department.countDocuments();

    const totalTeachers =
      await User.countDocuments({
        role: "teacher",
      });

    res.json({
      totalStudents,
      totalDepartments,
      totalTeachers,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getActiveDepartments =
async (req, res) => {
  try {
    const departments =
      await Department.find({
        status: "active",
      });

    res.json(departments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
