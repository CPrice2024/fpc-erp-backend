import Department from "../models/Department.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import bcrypt from "bcryptjs";

export const createDepartment = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      email,
      phone,
      established,
      headName,
    } = req.body;

    const exists = await Department.findOne({
      $or: [{ name }, { code }],
    });

    if (exists) {
      return res.status(400).json({
        message: "Department already exists",
      });
    }

    const department = await Department.create({
      name,
      code,
      description,
      email,
      phone,
      established,
    });

    const plainPassword = `${code}@123`;

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
      name: headName || `${name} Head`,
      email,
      password: hashedPassword,
      role: "department_head",
      department: department._id,
    });

    department.departmentHead = user._id;
    await department.save();

    res.status(201).json({
      message: "Department created successfully",
      department,
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
export const getDepartments = async (req, res) => {
try {
if (!req.user) {
  return res.status(401).json({
    message: "Unauthorized",
  });
}

const user = req.user;
let departments = [];

// =========================
// COLLEGE HEAD
// =========================

if (user.role === "college_head") {

  const rawDepartments =
    await Department.find()
      .populate(
        "departmentHead",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

  departments =
    await Promise.all(
      rawDepartments.map(
        async (dept) => {

          const students =
            await Student.countDocuments({
              department: dept._id,
            });

            console.log(
  "Department:",
  dept.name,
  "ID:",
  dept._id
);

const teacherUsers =
  await User.find({
    role: "teacher",
  });

console.log(
  "Teachers:",
  teacherUsers
);

          const teachers =
            await User.countDocuments({
              role: "teacher",
              department: dept._id,
            });

          const courses =
            await Course.countDocuments({
              department: dept._id,
            });

          return {
            ...dept.toObject(),
            students,
            teachers,
            courses,
          };
        }
      )
    );
}

// =========================
// DEPARTMENT HEAD
// =========================

else if (
  user.role === "department_head"
) {

  const rawDepartments =
    await Department.find({
      _id: user.department,
    }).populate(
      "departmentHead",
      "name email"
    );

  departments =
    await Promise.all(
      rawDepartments.map(
        async (dept) => {

          const students =
            await Student.countDocuments({
              department: dept._id,
            });

          const teachers =
            await User.countDocuments({
              role: "teacher",
              department: dept._id,
            });

          const courses =
            await Course.countDocuments({
              department: dept._id,
            });

          return {
            ...dept.toObject(),
            students,
            teachers,
            courses,
          };
        }
      )
    );
}

else {
  return res.status(403).json({
    message: "Access denied",
  });
}

res.json(departments);

} catch (error) {
res.status(500).json({
message: error.message,
});
}
};


export const updateDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      email,
      phone,
      established,
      headName,
    } = req.body;

    const department =
      await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    // =========================
    // Update Department
    // =========================

    department.name = name;
    department.description = description;
    department.email = email;
    department.phone = phone;
    department.established = established;

    await department.save();

    // =========================
    // Update Department Head User
    // =========================

    if (department.departmentHead) {
      await User.findByIdAndUpdate(
        department.departmentHead,
        {
          name: headName,
          email: email,
        }
      );
    }

    const updatedDepartment =
      await Department.findById(
        department._id
      ).populate(
        "departmentHead",
        "name email"
      );

    res.json({
      message:
        "Department updated successfully",
      department: updatedDepartment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    // remove department reference from users
    await User.updateMany(
      { department: department._id },
      { $set: { department: null } }
    );

    // delete department head if exists
    if (department.departmentHead) {
      await User.findByIdAndDelete(department.departmentHead);
    }

    await Department.findByIdAndDelete(req.params.id);

    res.json({
      message: "Department deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

 export const assignDepartmentHead = async (req, res) => {
  try {
    const { departmentId, userId } = req.body;

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ensure role is department head
    if (user.role !== "department_head") {
      return res.status(400).json({
        message: "User is not a department head",
      });
    }

    // assign both sides (IMPORTANT)
    department.departmentHead = user._id;
    await department.save();

    user.department = department._id;
    await user.save();

    res.json({
      message: "Department head assigned successfully",
      department,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDepartmentDashboard = async (req, res) => {
  try {
    const user = req.user;

    // =========================
    // 👑 COLLEGE HEAD DASHBOARD
    // =========================
    if (user.role === "college_head") {

      const totalDepartments = await Department.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalDeptHeads = await User.countDocuments({
        role: "department_head",
      });

      const departments = await Department.find()
        .populate("departmentHead", "name email")
        .sort({ createdAt: -1 });

      return res.json({
        role: "college_head",
        stats: {
          totalDepartments,
          totalUsers,
          totalDeptHeads,
        },
        departments,
      });
    }

    // =========================
    // 🏫 DEPARTMENT HEAD DASHBOARD
    // =========================
    if (user.role === "department_head") {

      const department = await Department.findById(user.department)
        .populate("departmentHead", "name email");

      if (!department) {
        return res.status(404).json({
          message: "Department not found",
        });
      }

      const totalUsers = await User.countDocuments({
        department: user.department,
      });

      const totalDeptHeads = await User.countDocuments({
        role: "department_head",
        department: user.department,
      });

      return res.json({
        role: "department_head",
        department,
        stats: {
          totalUsers,
          totalDeptHeads,
          students: department.students,
          faculty: department.faculty,
        },
      });
    }

    // =========================
    // ❌ NO ACCESS
    // =========================
    return res.status(403).json({
      message: "Access denied",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
  

  