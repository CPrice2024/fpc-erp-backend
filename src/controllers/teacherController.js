import User from "../models/User.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Grade from "../models/Grade.js";

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

export const getTeacherDashboard = async (req, res) => {
  try {

    const teacher = await User.findById(req.user.id)
      .populate("course")
      .populate("department", "name");

    if (!teacher || !teacher.course) {
      return res.status(400).json({
        message: "No course assigned."
      });
    }

  const students = await Student.find({
  department: teacher.course.department._id,
  level: teacher.course.level,
  semester: teacher.course.semester,
  section: teacher.course.section,
  enrollmentStatus: "Enrolled",
})
.populate("department", "name")
.sort({ firstName: 1 });

   const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const attendanceToday = await Attendance.find({

  teacher: teacher._id,

  course: teacher.course._id,

  date: {
    $gte: today,
    $lt: tomorrow,
  },

});

    const grades = await Grade.find({
      teacher: teacher._id,
      course: teacher.course._id,
    });

    const present = attendanceToday.filter(
      a => a.status === "Present"
    ).length;

    const absent = attendanceToday.filter(
      a => a.status === "Absent"
    ).length;

    const average =
      grades.length > 0
        ? (
            grades.reduce(
              (sum, g) => sum + g.total,
              0
            ) / grades.length
          ).toFixed(2)
        : 0;

    res.json({
      teacher,
      course: teacher.course,

      stats: {
        totalStudents: students.length,
        presentToday: present,
        absentToday: absent,
        averageMark: average,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const getMyCourse = async (req, res) => {

  try {

    const teacher = await User.findById(req.user.id)
      .populate({
        path: "course",
        populate: {
          path: "department",
          select: "name",
        },
      });

    res.json(teacher.course);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const getStudentProfile = async (req, res) => {

  try {

    const student = await Student.findById(req.params.id)
      .populate("department", "name");

    const grades = await Grade.find({
      student: student._id,
    }).populate(
      "course",
      "courseCode courseName"
    );

    const attendance = await Attendance.find({
      student: student._id,
    });

    res.json({
      student,
      grades,
      attendance,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const getMyStudents = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id).populate({
  path: "course",
  populate: {
    path: "department",
  },
});
    if (!teacher || !teacher.course) {
      return res.json([]);
    }

    const students = await Student.find({
  department: teacher.course.department._id,
  level: teacher.course.level,
  semester: teacher.course.semester,
  section: teacher.course.section,
  enrollmentStatus: "Enrolled",
})
.populate("department", "name")
.sort({ firstName: 1 });

    res.json(students);

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

export const saveAttendance = async (req, res) => {
  try {

    const { records } = req.body;

    for (const item of records) {

      await Attendance.findOneAndUpdate(

        {
          student: item.student,
          course: item.course,
          date: item.date,
        },

        {
          teacher: req.user.id,
          department: req.user.department,

          student: item.student,
          course: item.course,
          date: item.date,

          status: item.status,
          remark: item.remark || "",
        },

        {
          upsert: true,
          new: true,
        }

      );

    }

    res.json({
      message: "Attendance saved successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};