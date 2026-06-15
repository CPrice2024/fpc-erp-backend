import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Department from "../models/Department.js";
import User from "../models/User.js";

export const getCollegeReports = async (req, res) => {
try {

const [
  totalStudents,
  totalTeachers,
  totalCourses,
  totalDepartments,
  totalDepartmentHeads,
  activeStudents,
] = await Promise.all([
  Student.countDocuments(),

  User.countDocuments({
    role: "teacher",
  }),

  Course.countDocuments(),

  Department.countDocuments(),

  User.countDocuments({
    role: "department_head",
  }),

  Student.countDocuments({
    status: "active",
  }),
]);

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
          department: dept._id,
        });

      const teachers =
  await User.countDocuments({
    role: "teacher",
    department: dept._id,
  });

      const courses =
        await Course.countDocuments({
          department: dept._id,
        });

      return {
        _id: dept._id,
        name: dept.name,
        code: dept.code,

        students,
        teachers,
        courses,

        departmentHead:
          dept.departmentHead,
      };
    })
  );

res.json({
  stats: {
    totalStudents,
    activeStudents,
    totalTeachers,
    totalCourses,
    totalDepartments,
    totalDepartmentHeads,
  },

  departmentSummary,
});

} catch (error) {
console.error(
"College Report Error:",
error
);
res.status(500).json({
  message: error.message,
});

}
};
