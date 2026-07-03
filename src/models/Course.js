
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },

    courseName: {
      type: String,
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: null,
    },

    level: {
      type: String,
      required: true,
    },

    creditHour: {
      type: Number,
      default: 3,
    },
    section: {
    type: String,
    required: true,
},
    status: {
  type: String,
  enum: ["active", "inactive"],
  default: "active",
},
  },
  
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Course",
  courseSchema
);