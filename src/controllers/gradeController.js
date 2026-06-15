
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