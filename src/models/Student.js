import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    fatherName: {
      type: String,
      required: true,
    },

    grandfatherName: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },

    phone: String,
    email: String,

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    admissionYear: {
      type: Number,
      default: new Date().getFullYear(),
    },

    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Student",
  studentSchema
);