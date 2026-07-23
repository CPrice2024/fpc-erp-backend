import Course from "../models/Course.js";

// ==============================
// Create Course
// ==============================
export const createCourse = async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      level,
      semester,
      section,
      nominalDuration,
    } = req.body;

    // Check duplicate
    const exists = await Course.findOne({ courseCode });

    if (exists) {
      return res.status(400).json({
        message: "Course code already exists",
      });
    }

    const course = await Course.create({
      courseCode,
      courseName,
      department: req.user.department,
      level,
      semester,
      section,
      nominalDuration,
    });

    res.status(201).json(course);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get Courses
// ==============================
export const getCourses = async (req, res) => {
  try {

    const filter = {};

    if (req.user.role === "department_head") {
      filter.department = req.user.department;
    }

    const courses = await Course.find(filter)
      .populate("teacher", "name email")
      .populate("department", "name code")
      .sort({ createdAt: -1 });

    res.json(courses);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get One Course
// ==============================
export const getCourse = async (req, res) => {
  try {

    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("department", "name");

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update Course
// ==============================
export const updateCourse = async (req, res) => {
  try {

    const course =
      await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(course);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Course Statistics
// ==============================
export const getCourseStats = async (req, res) => {
  try {

    const filter = {};

    if (req.user.role === "department_head") {
      filter.department = req.user.department;
    }

    const totalCourses = await Course.countDocuments(filter);

    const assignedCourses = await Course.countDocuments({
      ...filter,
      teacher: { $ne: null },
    });

    const unassignedCourses =
      totalCourses - assignedCourses;

    res.json({
      totalCourses,
      assignedCourses,
      unassignedCourses,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==============================
// Delete Course
// ==============================
export const deleteCourse = async (req, res) => {
  try {

    await Course.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Course deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};