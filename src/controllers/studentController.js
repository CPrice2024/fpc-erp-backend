import Student from "../models/Student.js";
import Grade from "../models/Grade.js";
import Attendance from "../models/Attendance.js";

export const createStudent = async (
  req,
  res
) => {
  try {
    console.log("BODY:", req.body);
console.log("FILE:", req.file);
console.log("USER:", req.user);

const {
  // Personal
  firstName,
  fatherName,
  grandfatherName,
  gender,
  dob,
  nationality,

  // Contact
  phone,
  email,
  region,
  city,
  Woreda,
  SpecificPlace,
  address,

  // Education
  institutionName,
  academicYear,
  educationType,
  highestQualification,
  previousInstitution,
  previousEducation,
  department,
  program,
  major,
  level,
 semester,
 section,
  batch,
  studyMode,
  enrollmentStatus,
  educationSponsor,
  educationLanguage,
  registrationDate,
  educationStartDate,
  educationEndDate,
  durationMonths,

  // Guardian
  guardianName,
  guardianPhone,
  relationship,

  // Inmate
  isInmate,
  prisonId,
  crimeType,
  sentenceDuration,
  securityLevel,
  prisonFacility,
  cellNumber,
  imprisonmentStartDate,
  expectedReleaseDate,
  paroleDate,
  currentStatus,
  assignedOfficer,
  officerPhone,

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

    const inmateStatus =
  isInmate === "true" ||
  isInmate === true;

    const student = await Student.create({
  studentId,

  // Personal
  firstName,
  fatherName,
  grandfatherName,
  gender,
  dob: dob || null,
  nationality,

  // Photo
  photo,

  // Contact
  phone,
  email,
  region,
  city,
  Woreda,
  SpecificPlace,
  address,

  // Education
  institutionName,
  academicYear,
  educationType,
  highestQualification,
  previousInstitution,
  previousEducation,
  department,
  program,
  major,
  level,
  semester,
  section,
  batch,
  studyMode,
  enrollmentStatus,
  educationSponsor,
  educationLanguage,
  registrationDate:
  registrationDate || null,
  educationStartDate:
  educationStartDate || null,
  educationEndDate:
  educationEndDate || null,
  durationMonths:
  durationMonths
    ? Number(durationMonths)
    : null,

  // Guardian
  guardianName,
  guardianPhone,
  relationship,

  // Inmate
  isInmate: inmateStatus,
  prisonId: inmateStatus ? prisonId : "",
  crimeType: inmateStatus ? crimeType : "",
  sentenceDuration: inmateStatus && sentenceDuration
  ? Number(sentenceDuration)
  : null,
  securityLevel: inmateStatus
  ? securityLevel
  : "",
  prisonFacility: inmateStatus
  ? prisonFacility
  : "",
  cellNumber: inmateStatus
  ? cellNumber
  : "",
  imprisonmentStartDate: inmateStatus
  ? imprisonmentStartDate || null
  : null,
  expectedReleaseDate: inmateStatus
  ? expectedReleaseDate || null
  : null,
  paroleDate: inmateStatus
  ? paroleDate || null
  : null,
  currentStatus: inmateStatus
  ? currentStatus
  : "",
  assignedOfficer: inmateStatus
  ? assignedOfficer
  : "",
  officerPhone: inmateStatus
  ? officerPhone
  : "",

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

export const getStudents = async (req, res) => {
  try {
    let filter = {};

    // Department Head → only students in their department
    if (req.user.role === "department_head") {
      filter.department = req.user.department;
    }

    // College Head & Registrar → all students
    if (
      req.user.role === "college_head" ||
      req.user.role === "registrar"
    ) {
      filter = {};
    }

    // Optional Filters
    if (req.query.level) {
      filter.level = req.query.level;
    }

    if (req.query.semester) {
      filter.semester = req.query.semester;
    }

    const students = await Student.find(filter)
      .populate("department", "name code")
      .sort({ createdAt: -1 });

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
      console.log("========== UPDATE DATA ==========");
      console.log(updateData);
      console.log("===============================");

      updateData.isInmate =
        req.body.isInmate === "true" ||
        req.body.isInmate === true;

      if (!updateData.isInmate) {
  updateData.prisonId = "";
  updateData.crimeType = "";
  updateData.sentenceDuration = null;
  updateData.securityLevel = "";
  updateData.prisonFacility = "";
  updateData.cellNumber = "";
  updateData.imprisonmentStartDate = null;
  updateData.expectedReleaseDate = null;
  updateData.paroleDate = null;
  updateData.currentStatus = "";
  updateData.assignedOfficer = "";
  updateData.officerPhone = "";
}  
      
        updateData.durationMonths =
  updateData.durationMonths
    ? Number(updateData.durationMonths)
    : null;

updateData.sentenceDuration =
  updateData.sentenceDuration
    ? Number(updateData.sentenceDuration)
    : null;

[
  "dob",
  "registrationDate",
  "educationStartDate",
  "educationEndDate",
  "imprisonmentStartDate",
  "expectedReleaseDate",
  "paroleDate",
].forEach((field) => {
  updateData[field] =
    updateData[field] || null;
});

      if (req.file) {
        updateData.photo =
          `/uploads/students/${req.file.filename}`;
      }
      console.log("UPDATE DATA");
console.log(updateData);

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

     const grades = await Grade.find({
  student: req.params.id,
})
.populate("course")
.populate("teacher", "name");

console.log("========== GRADES ==========");
console.log(JSON.stringify(grades, null, 2));
console.log("============================");

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

  // =====================================
// Student Statistics
// =====================================
export const getStudentStats = async (req, res) => {
  try {
    let filter = {};

    // Department Head -> only own department
    if (req.user.role === "department_head") {
      filter.department = req.user.department;
    }

    const totalStudents = await Student.countDocuments(filter);

    const maleStudents = await Student.countDocuments({
      ...filter,
      gender: "Male",
    });

    const femaleStudents = await Student.countDocuments({
      ...filter,
      gender: "Female",
    });

    const activeStudents = await Student.countDocuments({
      ...filter,
      enrollmentStatus: "Active",
    });

    res.json({
      totalStudents,
      maleStudents,
      femaleStudents,
      activeStudents,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getStudentEnrollments = async (req, res) => {
  try {
    const grades = await Grade.find({
      student: req.params.id,
    })
      .populate("course")
      .populate("teacher");

    res.json(grades);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      student: req.params.id,
    }).populate("course");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};