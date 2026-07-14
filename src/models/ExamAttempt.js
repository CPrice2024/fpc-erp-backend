import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

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

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    startTime: {
      type: Date,
      default: Date.now,
    },

    submittedAt: Date,

    duration: Number,

    score: {
      type: Number,
      default: 0,
    },

    totalMarks: Number,

    percentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "In Progress",
        "Submitted",
        "Expired",
      ],
      default: "In Progress",
    },

    isPassed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ExamAttempt",
  examAttemptSchema
);