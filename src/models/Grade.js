import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
    },

    semester: {
      type: String,
      required: true,
    },

    assignment: {
      type: Number,
      default: 0,
      min: 0,
    },

    quiz: {
      type: Number,
      default: 0,
      min: 0,
    },

    midExam: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalExam: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    letterGrade: {
      type: String,
      enum: ["A", "B", "C", "D", "F"],
      default: "F",
    },

    gradePoint: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Passed", "Failed"],
      default: "Failed",
    },

    remark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate grade records for the same course in the same semester
gradeSchema.index(
  {
    student: 1,
    course: 1,
    semester: 1,
    academicYear: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("Grade", gradeSchema);