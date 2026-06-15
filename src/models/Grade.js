
import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignment: {
      type: Number,
      default: 0,
    },

    quiz: {
      type: Number,
      default: 0,
    },

    midExam: {
      type: Number,
      default: 0,
    },

    finalExam: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    letterGrade: {
      type: String,
      default: "F",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Grade", gradeSchema);