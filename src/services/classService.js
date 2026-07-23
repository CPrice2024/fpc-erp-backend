import Course from "../models/Course.js";

export const getClassCourses = async ({
  department,
  level,
  semester,
  section,
}) => {
  return await Course.find({
    department,
    level,
    semester,
    section,
  })
    .populate("department", "name")
    .populate("teacher", "name email");
};

export const getClassStudents = async ({
  department,
  level,
  semester,
  section,
}) => {
  const Student = (await import("../models/Student.js")).default;

  return await Student.find({
    department,
    level,
    semester,
    section,
    enrollmentStatus: "Enrolled",
  })
    .populate("department", "name")
    .sort({ firstName: 1 });
};