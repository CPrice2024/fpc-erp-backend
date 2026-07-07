import Grade from "../models/Grade.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

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

const getGradePoint =
  (letterGrade) => {

    const map = {
      A: 4.0,
      B: 3.0,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    };

    return (
      map[letterGrade] || 0
    );
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

      const total =
        Number(item.assignment) +
        Number(item.quiz) +
        Number(item.midExam) +
        Number(item.finalExam);

      if (total > 100) {
        return res.status(400).json({
          message: "Total marks cannot exceed 100."
        });
      }

      // ===== GRADE =====

      let letter = "F";

      if (total >= 90) letter = "A";
      else if (total >= 80) letter = "B";
      else if (total >= 70) letter = "C";
      else if (total >= 60) letter = "D";

      const gradePoint = getGradePoint(letter);

      const status =
        gradePoint >= 2
          ? "Passed"
          : "Failed";

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
          letterGrade: letter,
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
  "courseCode courseName creditHour"
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
          "courseCode courseName creditHour"
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
            totalCredits: 0,
          };
        }

        const credits =
          grade.course
            ?.creditHour || 3;

        reportMap[
          studentId
        ].totalPoints +=
          getGradePoint(
            grade.letterGrade
          ) *
          credits;

        reportMap[
          studentId
        ].totalCredits +=
          credits;
      }
    );

    const report =
      Object.values(
        reportMap
      ).map((s) => {

        const gpa =
          s.totalCredits > 0
            ? (
                s.totalPoints /
                s.totalCredits
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