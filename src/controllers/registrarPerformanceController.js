import Student from "../models/Student.js";

export const getRegistrarPerformance =
async (req, res) => {
  try {

    const registrarId =
      req.params.id;

    const totalStudents =
      await Student.countDocuments({
        createdBy: registrarId,
      });

    const today =
      new Date();

    today.setHours(
      0, 0, 0, 0
    );

    const todayStudents =
      await Student.countDocuments({
        createdBy: registrarId,
        createdAt: {
          $gte: today,
        },
      });

    const monthStart =
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );

    const monthlyStudents =
      await Student.countDocuments({
        createdBy: registrarId,
        createdAt: {
          $gte: monthStart,
        },
      });

    res.json({
      totalStudents,
      todayStudents,
      monthlyStudents,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};