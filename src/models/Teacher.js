import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Department",
      required:true
    },
    courses:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Course"
    }],

    experience: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model(
  "Teacher",
  teacherSchema
);

export default Teacher;