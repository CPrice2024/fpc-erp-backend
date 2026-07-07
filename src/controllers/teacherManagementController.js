import User from "../models/User.js";
import Course from "../models/Course.js";
import bcrypt from "bcryptjs";

export const createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      gender,
      specialization,
      experience,
      courseId,
    } = req.body;

    // Course is required
    if (!courseId) {
      return res.status(400).json({
        message: "Please select a course.",
      });
    }

    // Check duplicate email
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Teacher already exists",
      });
    }

    // Find the selected course
    const course = await Course.findOne({
      _id: courseId,
      department: req.user.department,
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Prevent duplicate teacher assignment
    if (course.teacher) {
      return res.status(400).json({
        message: "This course already has a teacher assigned.",
      });
    }

    // Generate teacher code
    const count = await User.countDocuments({
      role: "teacher",
    });

    const teacherCode = `TEA${String(count + 1).padStart(3, "0")}`;

    const plainPassword = `${teacherCode}@123`;

    const hashedPassword = await bcrypt.hash(
      plainPassword,
      10
    );

    // Create teacher
    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      gender,
      specialization,
      experience,
      department: req.user.department,
      course: course._id,
    });

    // Link teacher to course
    course.teacher = teacher._id;
    await course.save();

    res.status(201).json({
      message: "Teacher created successfully",
      teacher,
      loginCredentials: {
        email,
        password: plainPassword,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const getTeachers =
  async (req, res) => {
    try {
      const teachers =
        await User.find({
          role: "teacher",
          department:
            req.user.department,
        })
          .select("-password")
          .populate("department","name")
          .populate("course", "courseCode courseName level semester section");

      res.json(teachers);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher",
      department: req.user.department,
    })
      .select("-password")
      .populate("department", "name")
      .populate(
        "course",
        "courseCode courseName level semester section creditHour"
      );

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.json(teacher);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      gender,
      specialization,
      experience,
      status,
      courseId,
    } = req.body;

    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher",
      department: req.user.department,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // Remove teacher from previous course
    if (
      teacher.course &&
      teacher.course.toString() !== courseId
    ) {
      await Course.findByIdAndUpdate(
        teacher.course,
        {
          teacher: null,
        }
      );
    }

    // Assign new course
    if (courseId) {
      const course = await Course.findOne({
        _id: courseId,
        department: req.user.department,
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Prevent assigning another teacher's course
      if (
        course.teacher &&
        course.teacher.toString() !== teacher._id.toString()
      ) {
        return res.status(400).json({
          message:
            "This course already has a teacher assigned.",
        });
      }

      course.teacher = teacher._id;
      await course.save();

      teacher.course = course._id;
    }

    teacher.name = name;
    teacher.email = email;
    teacher.gender = gender;
    teacher.specialization = specialization;
    teacher.experience = experience;
    teacher.status = status;

    await teacher.save();

    res.json({
      message: "Teacher updated successfully",
      teacher,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetTeacherPassword = async (req, res) => {
  try {

    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher",
      department: req.user.department,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const password = "Teacher@123";

    teacher.password = await bcrypt.hash(password, 10);

    await teacher.save();

    res.json({
      message: "Password reset successfully.",
      password,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getTeacherStats = async (req, res) => {
  try {

    const totalTeachers = await User.countDocuments({
      role: "teacher",
      department: req.user.department,
    });

    const activeTeachers = await User.countDocuments({
      role: "teacher",
      department: req.user.department,
      status: "active",
    });

    const inactiveTeachers = await User.countDocuments({
      role: "teacher",
      department: req.user.department,
      status: "inactive",
    });

    res.json({
      totalTeachers,
      activeTeachers,
      inactiveTeachers,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteTeacher = async (req, res) => {
  try {

    const teacher = await User.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    if (teacher.course) {
      await Course.findByIdAndUpdate(
        teacher.course,
        {
          teacher: null,
        }
      );
    }

    await teacher.deleteOne();

    res.json({
      message: "Teacher deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};