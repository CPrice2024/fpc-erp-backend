import Grade from "../models/Grade.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import { calculateGrade, getGradePoint, } from "../utils/gradeCalculator.js";

export const getStudentsForGrades =
async (req, res) => {
  try {
    // Find logged-in teacher
const teacher = await User.findById(req.user.id)
  .populate("course");
  console.log("========== TEACHER ==========");
console.log(JSON.stringify(teacher, null, 2));
console.log("=============================");

if (!teacher.course) {
  return res.status(400).json({
    message: "No course assigned to this teacher.",
  });
}

// Fetch only students for the teacher's class
const students = await Student.find({
  department: teacher.department,
  level: teacher.course.level,
  semester: teacher.course.semester,
  section: teacher.course.section,
})
.populate("department", "name");

res.json(students);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const saveGrades = async (req, res) => {
  try {

    console.log("========== GRADES REQUEST ==========");
    console.log(JSON.stringify(req.body, null, 2));
    const grades = req.body;

    for (const item of grades) {
      console.log("Processing:", item);

      // ===== VALIDATION =====

      if (item.assignment < 0 || item.assignment > 20) {
        return res.status(400).json({
          message: "Assignment must be between 0 and 20."
        });
      }

      if (item.quiz < 0 || item.quiz > 10) {
        return res.status(400).json({
          message: "Quiz must be between 0 and 10."
        });
      }

      if (item.midExam < 0 || item.midExam > 30) {
        return res.status(400).json({
          message: "Mid Exam must be between 0 and 30."
        });
      }

      if (item.finalExam < 0 || item.finalExam > 40) {
        return res.status(400).json({
          message: "Final Exam must be between 0 and 40."
        });
      }

      const validationTotal =
  Number(item.assignment) +
  Number(item.quiz) +
  Number(item.midExam) +
  Number(item.finalExam);

if (validationTotal > 100) {
  return res.status(400).json({
    message: "Total marks cannot exceed 100."
  });
}

      // ===== GRADE =====

    const {

  total,

  letterGrade,

  gradePoint,

  status,

} = calculateGrade({

  assignment: item.assignment,

  quiz: item.quiz,

  midExam: item.midExam,

  finalExam: item.finalExam,

});

      await Grade.findOneAndUpdate(
        {
          student: item.student,
          course: item.course,
          semester: item.semester,
          academicYear: item.academicYear,
        },
        {
          teacher: req.user.id,
          department: req.user.department,

          assignment: item.assignment,
          quiz: item.quiz,
          midExam: item.midExam,
          finalExam: item.finalExam,

          total,
          letterGrade,
          gradePoint,
          status,

          semester: item.semester,
          academicYear: item.academicYear,

          remark: item.remark || "",
        },
        {
          upsert: true,
          new: true,
        }
      );
    }

    res.json({
      message: "Grades saved successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getGradeReport =
async (req, res) => {

  try {

    const grades =
      await Grade.find()
        .populate({
          path: "student",
          populate: {
            path: "department",
            select: "name",
          },
        })
        .populate(
  "course",
  "courseCode courseName nominalDuration"
)
.populate(
  "teacher",
  "name"
);

    res.json(grades);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const getCourseGrades = async (req, res) => {
  try {

    const teacher = await User.findById(req.user.id)
      .populate("course");

    if (!teacher || !teacher.course) {
      return res.status(400).json({
        message: "No course assigned.",
      });
    }

    const grades = await Grade.find({
      course: teacher.course._id,
    });

    res.json(grades);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const getGradeSummary =
async (req, res) => {

  try {

    const grades =
      await Grade.find()
        .populate({
          path: "student",
          populate: {
            path: "department",
            select: "name",
          },
        })
        .populate(
          "course",
          "courseCode courseName nominalDuration"
        )
        .populate(
          "teacher",
          "name"
        );

    const reportMap = {};

    grades.forEach(
      (grade) => {

        if (!grade.student)
          return;

        const studentId =
          grade.student._id.toString();

        if (
          !reportMap[studentId]
        ) {

          reportMap[
            studentId
          ] = {
            _id:
              grade.student._id,

            studentId:
              grade.student.studentId,

            firstName:
              grade.student.firstName,

            fatherName:
              grade.student.fatherName,

            department:
              grade.student.department,

            level:
              grade.student.level,

            totalPoints: 0,
            totalnominalDurations: 0,
          };
        }

        const nominalDurations =
          grade.course
            ?.nominalDuration || 3;

        reportMap[
          studentId
        ].totalPoints +=
          getGradePoint(
            grade.letterGrade
          ) *
          nominalDurations;

        reportMap[
          studentId
        ].totalnominalDurations +=
          nominalDurations;
      }
    );

    const report =
      Object.values(
        reportMap
      ).map((s) => {

        const gpa =
          s.totalnominalDurations > 0
            ? (
                s.totalPoints /
                s.totalnominalDurations
              ).toFixed(2)
            : "0.00";

        return {
          ...s,
          gpa,
          status:
            gpa >= 2
              ? "Passed"
              : "Failed",
        };
      });

    res.json(report);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};