import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "college_head",
        "department_head",
        "registrar",
        "teacher",
        "student",
      ],
      default: "teacher",
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    /* ===== Teacher Fields ===== */

    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: null,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    specialization: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      default: 0,
    },

    /* ========================== */

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);