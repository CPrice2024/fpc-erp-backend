import Question from "../models/Question.js";
import Exam from "../models/Exam.js";

/* ======================================
   Create Question
====================================== */
export const createQuestion = async (req, res) => {
  try {
    // Find the exam
    const exam = await Exam.findById(req.body.exam);
    

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }
    const existingQuestion = await Question.findOne({
  exam: exam._id,
  order: req.body.order,
});

if (existingQuestion) {
  return res.status(400).json({
    message: `Question ${req.body.order} already exists in this exam.`,
  });
}
// Calculate current total marks
const currentMarks = await Question.aggregate([
  {
    $match: {
      exam: exam._id,
    },
  },
  {
    $group: {
      _id: null,
      total: {
        $sum: "$marks",
      },
    },
  },
]);

const usedMarks =
  currentMarks.length > 0
    ? currentMarks[0].total
    : 0;

if (usedMarks + Number(req.body.marks) > exam.totalMarks) {
  return res.status(400).json({
    message: `Total marks exceed exam limit (${exam.totalMarks}).`,
  });
}

    // Security: only the exam owner can add questions
    if (exam.teacher.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to add questions to this exam.",
      });
    }

    const question = await Question.create({
      ...req.body,

      teacher: req.user.id,
      course: exam.course,
      department: exam.department,
    });

    res.status(201).json(question);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

/* ======================================
   Get Questions By Exam
====================================== */
export const getQuestionsByExam = async (req, res) => {
  try {

    const questions = await Question.find({
      exam: req.params.examId,
    }).sort({ order: 1 });

    res.json(questions);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================
   Get Single Question
====================================== */
export const getQuestion = async (req, res) => {
  try {

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json(question);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================
   Update Question
====================================== */
export const updateQuestion = async (req, res) => {
  try {

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json({
      message: "Question updated successfully",
      question,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================
   Delete Question
====================================== */
export const deleteQuestion = async (req, res) => {
  try {

    const question = await Question.findByIdAndDelete(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json({
      message: "Question deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};