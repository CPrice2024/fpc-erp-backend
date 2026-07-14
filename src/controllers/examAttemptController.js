import ExamAttempt from "../models/ExamAttempt.js";
import Exam from "../models/Exam.js";
import StudentAnswer from "../models/StudentAnswer.js";
import Grade from "../models/Grade.js";
import { calculateGrade } from "../utils/gradeCalculator.js";

/* ==========================================
   START EXAM
========================================== */
export const startExam = async (req, res) => {
  try {

    const { examId, studentId } = req.body;

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    // prevent duplicate active attempt
    const existing = await ExamAttempt.findOne({
      exam: examId,
      student: studentId,
      status: "In Progress",
    });

    if (existing) {
      return res.json(existing);
    }

    const attempt = await ExamAttempt.create({
      exam: exam._id,
      student: studentId,
      teacher: exam.teacher,
      course: exam.course,
      department: exam.department,
      totalMarks: exam.totalMarks,
      startTime: new Date(),
      status: "In Progress",
    });

    res.status(201).json(attempt);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

/* ==========================================
   GET ATTEMPT
========================================== */
export const getExamAttempt = async (req, res) => {

  try {

    const attempt = await ExamAttempt.findById(req.params.id)
      .populate("student", "studentId firstName fatherName")
      .populate("exam", "title examType totalMarks")
      .populate("course", "courseCode courseName");

    if (!attempt) {

      return res.status(404).json({
        message: "Attempt not found",
      });

    }

    res.json(attempt);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

/* ==========================================
   SUBMIT EXAM
========================================== */
export const submitExam = async (req, res) => {

  try {

    const attempt =
      await ExamAttempt.findById(req.params.id);

    if (!attempt) {

      return res.status(404).json({
        message: "Attempt not found",
      });

    }
    // Load exam
const exam = await Exam.findById(attempt.exam);

if (!exam) {
  return res.status(404).json({
    message: "Exam not found",
  });
}

// Load all student answers
const answers = await StudentAnswer.find({
  attempt: attempt._id,
});
console.log("========== ANSWERS ==========");
console.log(JSON.stringify(answers, null, 2));
console.log("=============================");

// Calculate score
let score = 0;

answers.forEach((answer) => {

  score += answer.marksAwarded || 0;

});
console.log("Calculated Score:", score);

// Calculate percentage
const percentage =
  exam.totalMarks > 0
    ? (score / exam.totalMarks) * 100
    : 0;

// Update attempt
attempt.score = score;

attempt.percentage = Number(
  percentage.toFixed(2)
);

attempt.isPassed =
  score >= exam.passMark;

attempt.status = "Submitted";

attempt.submittedAt = new Date();

await attempt.save();
// =======================================
// Update Grade Automatically
// =======================================

const grade = await Grade.findOne({
  student: attempt.student,
  course: attempt.course,
});

if (grade) {

if (exam.examType === "Mid") {

    grade.digitalMidExam = score;

    grade.midExamSource = "Digital";

}

if (exam.examType === "Final") {

    grade.digitalFinalExam = score;

    grade.finalExamSource = "Digital";

}

 const effectiveMid =
  grade.midExamSource === "Digital"
    ? grade.digitalMidExam
    : grade.midExam;

const effectiveFinal =
  grade.finalExamSource === "Digital"
    ? grade.digitalFinalExam
    : grade.finalExam;

const calculated = calculateGrade({

  assignment: grade.assignment,

  quiz: grade.quiz,

  midExam: effectiveMid,

  finalExam: effectiveFinal,

});

  grade.total = calculated.total;

  grade.letterGrade = calculated.letterGrade;

  grade.gradePoint = calculated.gradePoint;

  grade.status = calculated.status;

  await grade.save();

  console.log("========== GRADE UPDATED ==========");

  console.log(JSON.stringify(grade, null, 2));

  console.log("==================================");

}


    res.json({
      message: "Exam submitted successfully",
      attempt,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

/* ==========================================
   STUDENT HISTORY
========================================== */
export const getStudentHistory = async (req, res) => {

  try {

    const history = await ExamAttempt.find({
      student: req.params.studentId,
    })
      .populate("exam", "title examType")
      .populate("course", "courseCode courseName")
      .sort({ createdAt: -1 });

    res.json(history);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};