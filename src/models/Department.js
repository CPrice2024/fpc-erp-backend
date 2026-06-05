import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

head: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    established: {
      type: String,
      default: "",
    },

    students: {
      type: Number,
      default: 0,
    },

    faculty: {
      type: Number,
      default: 0,
    },

    departmentHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);