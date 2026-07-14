import Exam from "../models/Exam.js";
import User from "../models/User.js";

/* =====================================
   Create Exam
===================================== */

export const createExam = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id)
      .populate("course");

    if (!teacher || !teacher.course) {
      return res.status(400).json({
        message: "No course assigned."
      });
    }

    const exam = await Exam.create({
      title: req.body.title,
      description: req.body.description,
      examType: req.body.examType,
      duration: req.body.duration,
      totalMarks: req.body.totalMarks,
      passMark: req.body.passMark,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      shuffleQuestions: req.body.shuffleQuestions,
      shuffleOptions: req.body.shuffleOptions,
      showResult: req.body.showResult,

      teacher: teacher._id,
      department: teacher.department,
      course: teacher.course._id,
    });

    res.status(201).json(exam);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


/* =====================================
   Get My Exams
===================================== */

export const getMyExams = async (req, res) => {

  try {

    const exams = await Exam.find({
      teacher: req.user.id,
    })
      .populate("course", "courseCode courseName")
      .sort({
        createdAt: -1,
      });

    res.json(exams);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


/* =====================================
   Get Single Exam
===================================== */

export const getExam = async (req, res) => {

  try {

    const exam = await Exam.findOne({
      _id: req.params.id,
      teacher: req.user.id,
    }).populate(
      "course",
      "courseCode courseName"
    );

    if (!exam) {

      return res.status(404).json({
        message: "Exam not found",
      });

    }

    res.json(exam);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


/* =====================================
   Update Exam
===================================== */

export const updateExam = async (req, res) => {

  try {

    const exam = await Exam.findOne({
      _id: req.params.id,
      teacher: req.user.id,
    });

    if (!exam) {

      return res.status(404).json({
        message: "Exam not found",
      });

    }

    Object.assign(exam, req.body);

    await exam.save();

    res.json({
      message: "Exam updated successfully",
      exam,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


/* =====================================
   Delete Exam
===================================== */

export const deleteExam = async (req, res) => {

  try {

    const exam = await Exam.findOne({
      _id: req.params.id,
      teacher: req.user.id,
    });

    if (!exam) {

      return res.status(404).json({
        message: "Exam not found",
      });

    }

    await exam.deleteOne();

    res.json({
      message: "Exam deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};