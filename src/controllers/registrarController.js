import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const createRegistrar = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      phone,
    } = req.body;

    const exists =
      await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message:
          "Registrar already exists",
      });
    }

    const plainPassword =
      "Registrar@123";

    const hashedPassword =
      await bcrypt.hash(
        plainPassword,
        10
      );

    const registrar =
      await User.create({
        name,
        email,
        phone,
        password:
          hashedPassword,
        role: "registrar",
      });

    res.status(201).json({
      message:
        "Registrar created successfully",

      registrar,

      loginCredentials: {
        email,
        password:
          plainPassword,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getRegistrars =
  async (req, res) => {
    try {
      const registrars =
        await User.find({
          role: "registrar",
        }).select("-password");

      res.json(registrars);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const deleteRegistrar =
  async (req, res) => {
    try {
      const registrar =
  await User.findOne({
    _id: req.params.id,
    role: "registrar",
  });

      if (!registrar) {
        return res.status(404).json({
          message:
            "Registrar not found",
        });
      }

      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Registrar deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  export const updateRegistrar =
async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      status,
    } = req.body;

    const registrar =
  await User.findOne({
    _id: req.params.id,
    role: "registrar",
  });

    if (!registrar) {
      return res.status(404).json({
        message:
          "Registrar not found",
      });
    }

    registrar.name = name;
    registrar.email = email;
    registrar.phone = phone;
    registrar.status = status;

    await registrar.save();

    res.json({
      message:
        "Registrar updated successfully",
      registrar,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const toggleRegistrarStatus =
async (req, res) => {
  try {

    const registrar =
  await User.findOne({
    _id: req.params.id,
    role: "registrar",
  });

    if (!registrar) {
      return res.status(404).json({
        message:
          "Registrar not found",
      });
    }

    registrar.status =
      registrar.status === "active"
        ? "inactive"
        : "active";

    await registrar.save();

    res.json({
      message:
        "Status updated successfully",
      registrar,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.params.id,
    })
      .populate("course")
      .populate("teacher");

    res.json(enrollments);
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