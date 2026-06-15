import Department from "../models/Department.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

export const getCollegeHeadDashboard =
async (req, res) => {
  try {

    const totalStudents =
      await Student.countDocuments();

    const totalTeachers =
  await User.countDocuments({
    role: "teacher",
  });

    const totalCourses =
      await Course.countDocuments();

    const totalDepartments =
      await Department.countDocuments();

    const departments =
      await Department.find()
        .populate(
          "departmentHead",
          "name email"
        );

    const departmentSummary =
      await Promise.all(
        departments.map(async (dept) => {

          const students =
            await Student.countDocuments({
              department: dept._id
            });

          const teachers =
  await User.countDocuments({
    role: "teacher",
    department: dept._id,
  });

          const courses =
            await Course.countDocuments({
              department: dept._id
            });

          return {
            _id: dept._id,
            name: dept.name,
            code: dept.code,
            students,
            teachers,
            courses,
            departmentHead:
              dept.departmentHead
          };
        })
      );

    const levelStats =
      await Student.aggregate([
        {
          $group: {
            _id: "$level",
            count: { $sum: 1 }
          }
        }
      ]);

    const recentStudents =
      await Student.find()
        .sort({ createdAt: -1 })
        .limit(10);

  const result = {
  stats: {
    totalStudents,
    totalTeachers,
    totalCourses,
    totalDepartments
  },
  departmentSummary,
  levelStats,
  recentStudents
};

console.log(
  "FINAL DASHBOARD RESPONSE:",
  JSON.stringify(result, null, 2)
);

res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};