import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

/* ==========================================
   GET STUDENTS FOR ATTENDANCE
========================================== */
export const getStudentsForAttendance = async (req, res) => {
  try {

    const teacher = await User.findById(req.user.id)
      .populate("course");

    if (!teacher || !teacher.course) {
      return res.status(400).json({
        message: "No course assigned to this teacher.",
      });
    }

    const students = await Student.find({
      department: teacher.department,
      level: teacher.course.level,
      semester: teacher.course.semester,
      section: teacher.course.section,
    }).populate("department", "name");

    res.json(students);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


/* ==========================================
   SAVE ATTENDANCE
========================================== */
export const saveAttendance = async (req, res) => {
  try {

    const teacher = await User.findById(req.user.id)
      .populate("course");

    if (!teacher || !teacher.course) {
      return res.status(400).json({
        message: "No course assigned."
      });
    }

    const { records } = req.body;

    const today = new Date();
    today.setHours(0,0,0,0);

    for (const item of records) {

      await Attendance.findOneAndUpdate(

        {
          student: item.student,
          teacher: req.user.id,
          course: teacher.course._id,
          date: today,
        },

        {
          student: item.student,
          teacher: req.user.id,
          department: teacher.department,
          course: teacher.course._id,
          date: today,

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
      message: "Attendance saved successfully"
    });

  }

  catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};

export const getTodayAttendance = async (req, res) => {
  try {

    const teacher = await User.findById(req.user.id)
      .populate("course");

    if (!teacher || !teacher.course) {
      return res.status(400).json({
        message: "No course assigned."
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const attendance = await Attendance.find({
      teacher: req.user.id,
      course: teacher.course._id,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    res.json(attendance);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


/* ==========================================
   GET ATTENDANCE HISTORY
========================================== */
export const getAttendanceHistory = async (req, res) => {

  try {

   const attendance = await Attendance.find({
  teacher: req.user.id,
})
.populate(
  "student",
  "studentId firstName fatherName"
)
.populate(
  "course",
  "courseCode courseName"
)
.populate(
  "teacher",
  "name email"
)
.populate(
  "department",
  "name"
)
.sort({
  date: -1,
});

    res.json(attendance);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};