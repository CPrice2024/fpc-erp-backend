import mongoose from "mongoose";

const digitalBookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    fileName: String,

    fileUrl: String,

    fileType: String,

    fileSize: Number,

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
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "DigitalBook",
  digitalBookSchema
);