
import Grade from "../models/Grade.js";
import Student from "../models/Student.js";

export const getStudentsForGrades =
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

export const saveGrades =
async (req, res) => {
  try {
    const grades = req.body;

    for (const item of grades) {

      const total =
        Number(item.assignment) +
        Number(item.quiz) +
        Number(item.midExam) +
        Number(item.finalExam);

      let letter = "F";

      if (total >= 90) letter = "A";
      else if (total >= 80) letter = "B";
      else if (total >= 70) letter = "C";
      else if (total >= 60) letter = "D";

      await Grade.create({
        ...item,
        teacher: req.user.id,
        total,
        letterGrade: letter,
      });
    }

    res.json({
      message:
        "Grades saved successfully",
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
          "title creditHour"
        );

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
          "creditHour"
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