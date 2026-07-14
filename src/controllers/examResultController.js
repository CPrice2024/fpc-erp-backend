import ExamAttempt from "../models/ExamAttempt.js";
import Exam from "../models/Exam.js";

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