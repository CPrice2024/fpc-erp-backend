import mongoose from "mongoose";

const teacherAttendanceSchema = new mongoose.Schema(
  {
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

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "present",
        "absent",
        "late",
      ],
      default: "present",
    },
  },
  {
    timestamps: true,
  }
);

teacherAttendanceSchema.index(
  {
    teacher: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "TeacherAttendance",
  teacherAttendanceSchema
);