import TeacherAttendance from "../models/TeacherAttendance.js";
import User from "../models/User.js";

/* ==========================================
   GET TEACHERS FOR ATTENDANCE
========================================== */
export const getTeachersAttendance = async (req, res) => {
  try {
    const teachers = await User.find({
      role: "teacher",
      department: req.user.department,
    })
      .select("-password")
      .populate("course", "courseCode courseName");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const attendance = await TeacherAttendance.find({
      department: req.user.department,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const result = teachers.map((teacher) => {
      const record = attendance.find(
        (a) => a.teacher.toString() === teacher._id.toString()
      );

      return {
        ...teacher.toObject(),
        attendanceStatus: record
          ? record.status
          : "not_marked",
      };
    });

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


/* ==========================================
   MARK / UPDATE ATTENDANCE
========================================== */
export const markTeacherAttendance = async (req, res) => {
  try {

    const { teacherId, status } = req.body;

    const teacher = await User.findOne({
      _id: teacherId,
      role: "teacher",
      department: req.user.department,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance =
      await TeacherAttendance.findOneAndUpdate(
        {
          teacher: teacherId,
          date: today,
        },
        {
          teacher: teacherId,
          department: req.user.department,
          markedBy: req.user.id,
          date: today,
          status,
        },
        {
          new: true,
          upsert: true,
        }
      );

    res.json({
      message: "Attendance saved successfully",
      attendance,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


/* ==========================================
   DASHBOARD STATS
========================================== */
export const getTeacherAttendanceStats = async (req, res) => {
  try {

    const totalTeachers =
      await User.countDocuments({
        role: "teacher",
        department: req.user.department,
      });

    const today = new Date();
    today.setHours(0,0,0,0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate()+1);

    const attendance =
      await TeacherAttendance.find({
        department: req.user.department,
        date:{
          $gte:today,
          $lt:tomorrow,
        }
      });

    const present =
      attendance.filter(a=>a.status==="present").length;

    const absent =
      attendance.filter(a=>a.status==="absent").length;

    const late =
      attendance.filter(a=>a.status==="late").length;

    res.json({
      totalTeachers,
      present,
      absent,
      late,
    });

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }
};


/* ==========================================
   ATTENDANCE HISTORY
========================================== */
export const getTeacherAttendanceHistory = async (req,res)=>{

  try{

    const history =
      await TeacherAttendance.find({
        department:req.user.department,
      })
      .populate(
        "teacher",
        "name email"
      )
      .populate(
        "markedBy",
        "name"
      )
      .sort({
        date:-1,
      });

    res.json(history);

  }catch(error){

    res.status(500).json({
      message:error.message,
    });

  }

};