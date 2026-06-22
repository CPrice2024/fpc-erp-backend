import Student from "../models/Student.js";
import Grade from "../models/Grade.js";

export const createStudent = async (
  req,
  res
) => {
  try {
    console.log("BODY:", req.body);
console.log("FILE:", req.file);
console.log("USER:", req.user);
   const {
  firstName,
  fatherName,
  grandfatherName,
  gender,
  dob,
  nationality,
  phone,
  email,
  region,
  city,
  address,
  department,
  level,
  batch,
  academicYear,
  guardianName,
  guardianPhone,
  relationship,
} = req.body;

    const lastStudent =
  await Student.findOne()
    .sort({ createdAt: -1 });

let studentId = "ST0001";

if (lastStudent?.studentId) {

  const lastNumber =
    parseInt(
      lastStudent.studentId.replace(
        "ST",
        ""
      )
    );

  studentId =
    `ST${String(
      lastNumber + 1
    ).padStart(4, "0")}`;
}

      const photo =
  req.file
    ? `/uploads/students/${req.file.filename}`
    : "";

   const student =
  await Student.create({
    studentId,
    firstName,
    fatherName,
    grandfatherName,
    gender,
    dob,
    nationality,
    phone,
    email,
    region,
    city,
    address,
    department,
    level,
    batch,
    academicYear,
    guardianName,
    guardianPhone,
    relationship,
    photo,
    createdBy: req.user.id,
  });

    res.status(201).json(student);

  } 
  catch (error) {

  console.error(
    "CREATE STUDENT ERROR:",
    error
  );

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
      await Student.find()
        .populate(
          "department",
          "name"
        )
        .sort({
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
  ).populate(
    "department",
    "name"
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
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);
      console.log("ID:", req.params.id);

      const updateData = {
        ...req.body,
      };

      if (req.file) {
        updateData.photo =
          `/uploads/students/${req.file.filename}`;
      }

      const student =
        await Student.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
          }
        ).populate(
          "department",
          "name"
        );

      res.json(student);

    } 
    catch (error) {

  console.error(
    "UPDATE STUDENT ERROR:",
    error
  );

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

  export const getStudentCourses =
  async (req, res) => {
    try {

      const grades =
        await Grade.find({
          student: req.params.id,
        })
          .populate(
            "course"
          )
          .populate(
            "teacher",
            "name"
          );

      const courses =
  grades.map((g) => ({
    _id: g._id,

    courseCode:
      g.course?.courseCode,

    courseName:
      g.course?.courseName,

    credits:
      g.course?.creditHour,

    creditHour:
      g.course?.creditHour,

    assignment:
      g.assignment,

    quiz:
      g.quiz,

    midExam:
      g.midExam,

    finalExam:
      g.finalExam,

    total:
      g.total,

    grade:
      g.letterGrade,

    letterGrade:
      g.letterGrade,

    status:
      g.letterGrade === "F"
        ? "failed"
        : "passed",

    teacher:
      g.teacher?.name,
  }));

      res.json(courses);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };