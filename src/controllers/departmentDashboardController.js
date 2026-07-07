import User from "../models/User.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Attendance from "../models/Attendance.js";

export const getDepartmentDashboard = async (req, res) => {
  try {

    const departmentId = req.user.department;

    /* ===============================
       Basic Statistics
    =============================== */

    const totalStudents = await Student.countDocuments({
      department: departmentId,
    });

    const totalTeachers = await User.countDocuments({
      role: "teacher",
      department: departmentId,
    });

    const totalCourses = await Course.countDocuments({
      department: departmentId,
    });

    /* ===============================
       Course Summary
    =============================== */

    const assignedCourses = await Course.countDocuments({
      department: departmentId,
      teacher: { $ne: null },
    });

    const unassignedCourses =
      totalCourses - assignedCourses;

    const activeCourses =
      await Course.countDocuments({
        department: departmentId,
        status: "active",
      });

    const inactiveCourses =
      await Course.countDocuments({
        department: departmentId,
        status: "inactive",
      });

    /* ===============================
       Today's Attendance
    =============================== */

    const today = new Date();
    today.setHours(0,0,0,0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate()+1);

    const attendance = await Attendance.find({
      department: departmentId,
      date:{
        $gte:today,
        $lt:tomorrow,
      },
    });

    const present =
      attendance.filter(a=>a.status==="Present").length;

    const absent =
      attendance.filter(a=>a.status==="Absent").length;

    const late =
      attendance.filter(a=>a.status==="Late").length;

    const attendanceRate =
      attendance.length === 0
        ? 0
        : Math.round((present/attendance.length)*100);

    /* ===============================
       Recent Students
    =============================== */

    const recentStudents =
      await Student.find({
        department: departmentId,
      })
      .sort({createdAt:-1})
      .limit(5)
      .select(
        "studentId firstName fatherName level"
      );

    /* ===============================
       Teacher Workload
    =============================== */

    const teachers =
      await User.find({
        role:"teacher",
        department:departmentId,
      })
      .populate(
        "course",
        "courseCode courseName"
      );

    const teacherWorkload =
      await Promise.all(
        teachers.map(async(t)=>{

          let studentCount = 0;

          if(t.course){

            studentCount =
              await Student.countDocuments({

                department:departmentId,

                level:t.course.level,

                semester:t.course.semester,

                section:t.course.section,

              });

          }

          return{

            _id:t._id,

            name:t.name,

            course:t.course,

            students:studentCount,

          };

        })
      );

    res.json({

      department:req.user.department,

      stats:{
        totalStudents,
        totalTeachers,
        totalCourses,
        attendanceRate,
      },

      courseSummary:{
        assignedCourses,
        unassignedCourses,
        activeCourses,
        inactiveCourses,
      },

      attendance:{
        present,
        absent,
        late,
      },

      recentStudents,

      teacherWorkload,

    });

  }

  catch(error){

    res.status(500).json({
      message:error.message,
    });

  }
};