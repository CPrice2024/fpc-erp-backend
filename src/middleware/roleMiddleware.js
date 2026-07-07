export const collegeHeadOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized - no user found",
    });
  }

  if (req.user.role !== "college_head") {
    return res.status(403).json({
      message: "College head access only",
    });
  }

  next();
};
export const departmentHeadOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized - no user found",
    });
  }

  if (req.user.role !== "department_head") {
    return res.status(403).json({
      message: "Department head access only",
    });
  }

  next();
};

export const registrarOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized - no user found",
    });
  }

  if (req.user.role !== "registrar") {
    return res.status(403).json({
      message: "Registrar access only",
    });
  }

  next();
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized - no user found",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};

export const teacherOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized - no user found",
    });
  }

  if (req.user.role !== "teacher") {
    return res.status(403).json({
      message: "Teacher access only",
    });
  }

  next();
};