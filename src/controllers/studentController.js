import Student from "../models/Student.js";

export const createStudent = async (
  req,
  res
) => {
  try {
    const {
      firstName,
      fatherName,
      grandfatherName,
      gender,
      phone,
      email,
      department,
      level,
    } = req.body;

    const count =
      await Student.countDocuments();

    const studentId =
      `ST${String(count + 1).padStart(4, "0")}`;

    const student =
      await Student.create({
        studentId,
        firstName,
        fatherName,
        grandfatherName,
        gender,
        phone,
        email,
        department,
        level,
      });

    res.status(201).json(student);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStudents = async (
  req,
  res
) => {
  try {
    const students =
      await Student.find().sort({
        createdAt: -1,
      });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStudent = async (
  req,
  res
) => {
  try {
    const student =
      await Student.findById(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateStudent =
  async (req, res) => {
    try {
      const student =
        await Student.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(student);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const deleteStudent =
  async (req, res) => {
    try {
      await Student.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Student deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };