import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
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

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    questionType: {
      type: String,
      enum: [
        "Multiple Choice",
        "Multiple Answer",
        "True/False",
        "Short Answer",
        "Essay",
        "Fill Blank",
        "Matching",
      ],
      default: "Multiple Choice",
    },

    marks: {
      type: Number,
      default: 1,
    },

    options: [
      {
        optionId: String,
        text: String,
      },
    ],

    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    explanation: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 1,
    },

    isRequired: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Published",
      ],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Question",
  questionSchema
);