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
      courseIds,
    } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Teacher already exists",
      });
    }

    const count = await User.countDocuments({
      role: "teacher",
    });

    const teacherCode = `TEA${String(count + 1).padStart(3, "0")}`;

    const plainPassword = `${teacherCode}@123`;

    const hashedPassword = await bcrypt.hash(
      plainPassword,
      10
    );

    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      gender,
      specialization,
      experience,
      department: req.user.department,
      courses: courseIds || [],
    });

    // Assign teacher to selected courses
    if (courseIds && courseIds.length > 0) {
      await Course.updateMany(
        {
          _id: { $in: courseIds },
          department: req.user.department,
        },
        {
          teacher: teacher._id,
        }
      );
    }

    res.status(201).json({
      message: "Teacher created successfully",
      teacher,
      loginCredentials: {
        email,
        password: plainPassword,
      },
    });

  } catch (error) {
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
          .populate(
            "department",
            "name"
          );

      res.json(teachers);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const deleteTeacher =
  async (req, res) => {
    try {
      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Teacher deleted",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };