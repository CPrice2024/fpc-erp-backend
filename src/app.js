import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import collegeHeadRoutes from "./routes/collegeHeadRoutes.js";
import registrarRoutes from "./routes/registrarRoutes.js";
import teacherManagementRoutes from "./routes/teacherManagementRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import teacherAttendanceRoutes from "./routes/teacherAttendanceRoutes.js";
import departmentDashboardRoutes from "./routes/departmentDashboardRoutes.js";
import digitalBookRoutes from "./routes/digitalBookRoutes.js";


import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import examAttemptRoutes from "./routes/examAttemptRoutes.js";
import studentAnswerRoutes from "./routes/studentAnswerRoutes.js";
import examResultRoutes from "./routes/examResultRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("__filename:", __filename);
console.log("__dirname:", __dirname);

const app = express();
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.use(cors());
app.use(express.json());

/* Routes */

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/college-head", collegeHeadRoutes);

app.use("/api/registrars", registrarRoutes);

app.use("/api/teachers", teacherManagementRoutes);

app.use("/api/teacher", teacherRoutes);

app.use("/api/grades",gradeRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/reports",reportRoutes );

const uploadsPath = path.join(__dirname, "..", "uploads");

console.log("Uploads Path:", uploadsPath);

app.use("/uploads", express.static(uploadsPath));

app.use("/api/finance", financeRoutes);

app.use("/api/teacher-attendance",teacherAttendanceRoutes);

app.use("/api/department-dashboard",departmentDashboardRoutes);


app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/exam-attempts", examAttemptRoutes);
app.use("/api/student-answers", studentAnswerRoutes);
app.use("/api/exam-results", examResultRoutes);
app.use("/api/books", digitalBookRoutes);

app.get("/hello", (req, res) => {
  res.send("Hello ERP");
});

/* Home Route */

// app.get("/", (req, res) => {
//  res.send("ERP API Running");
// });

// Serve React build
const frontendPath = path.resolve(__dirname, "..", "..", "frontend", "dist");
console.log("Frontend Path:", frontendPath);
console.log(
  "Index exists:",
  fs.existsSync(path.join(frontendPath, "index.html"))
);
app.use(express.static(frontendPath));

// React routes
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;