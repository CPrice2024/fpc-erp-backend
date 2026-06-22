import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import collegeHeadRoutes from "./routes/collegeHeadRoutes.js";
import registrarRoutes from "./routes/registrarRoutes.js";
import teacherManagementRoutes from "./routes/teacherManagementRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

/* Routes */

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/teachers", teacherRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/college-head", collegeHeadRoutes);

app.use("/api/registrars", registrarRoutes);

app.use("/api/department-teachers",teacherManagementRoutes );

app.use("/api/grades",gradeRoutes);

app.use("/api/reports",reportRoutes );

app.use("/uploads",express.static("uploads"));

app.use("/api/finance", financeRoutes);

/* Home Route */

app.get("/", (req, res) => {
  res.send("ERP API Running");
});

export default app;