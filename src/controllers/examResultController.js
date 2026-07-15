import ExamAttempt from "../models/ExamAttempt.js";
import Exam from "../models/Exam.js";
import StudentAnswer from "../models/StudentAnswer.js";

/* ======================================
   Get Exam Results By Course
====================================== */

export const getExamResults = async (req, res) => {

  try {

    const teacherId = req.user.id;

    const examType = req.query.examType;

    const course = req.query.course;

    const filter = {

      teacher: teacherId,

      status: "Submitted",

    };

    if (course) {

      filter.course = course;

    }

    const attempts = await ExamAttempt.find(filter)
      .populate("student", "studentId firstName fatherName")
      .populate("exam", "title examType totalMarks")
      .populate("course", "courseCode courseName");

    let results = attempts;

    if (examType) {

      results = attempts.filter(
        (a) => a.exam?.examType === examType
      );

    }

    res.json(results);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

export const getExamResultById = async (req, res) => {
  try {

    const attempt = await ExamAttempt.findById(req.params.attemptId)
      .populate(
        "student",
        "studentId firstName fatherName"
      )
      .populate(
        "exam",
        "title examType totalMarks passMark"
      )
      .populate(
        "course",
        "courseCode courseName"
      );

    if (!attempt) {
      return res.status(404).json({
        message: "Exam result not found",
      });
    }

    const answers = await StudentAnswer.find({
      attempt: attempt._id,
    }).populate(
      "question"
    );

    res.json({
      ...attempt.toObject(),
      answers,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};