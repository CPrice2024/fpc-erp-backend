import StudentAnswer from "../models/StudentAnswer.js";
import Question from "../models/Question.js";
import ExamAttempt from "../models/ExamAttempt.js";

/* ==========================================
   SAVE SINGLE ANSWER
========================================== */
export const saveAnswer = async (req, res) => {

  try {

    const {
      attempt,
      exam,
      question,
      student,
      selectedAnswer,
    } = req.body;

    const questionDoc =
      await Question.findById(question);

    if (!questionDoc) {

      return res.status(404).json({
        message: "Question not found",
      });

    }

    let isCorrect = false;
    let marksAwarded = 0;

    // Automatic marking for objective questions
    if (
      questionDoc.questionType === "Multiple Choice" ||
      questionDoc.questionType === "True/False"
    ) {

      isCorrect =
        selectedAnswer ===
        questionDoc.correctAnswer;

      if (isCorrect) {

        marksAwarded =
          questionDoc.marks;

      }

    }

    const answer =
      await StudentAnswer.findOneAndUpdate(

        {
          attempt,
          question,
        },

        {
          exam,
          student,
          selectedAnswer,
          isCorrect,
          marksAwarded,
        },

        {
          upsert: true,
          new: true,
        }

      );

    res.json(answer);

  }

  catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};
/* ==========================================
   GET STUDENT ANSWERS
========================================== */

export const getAttemptAnswers = async (
  req,
  res
) => {

  try {

    const answers =
      await StudentAnswer.find({

        attempt: req.params.attemptId,

      })
      .populate("question");

    res.json(answers);

  }

  catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};