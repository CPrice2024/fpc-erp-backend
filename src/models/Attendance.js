
import mongoose from "mongoose";

const attendanceSchema =
  new mongoose.Schema(
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

      date: {
        type: Date,
        default: Date.now,
      },

      status: {
        type: String,
        enum: [
          "Present",
          "Absent",
          "Late",
        ],
        default: "Present",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Attendance",
  attendanceSchema
);