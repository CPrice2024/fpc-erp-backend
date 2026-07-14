import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
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

    examType: {
      type: String,
      enum: [
        "Quiz",
        "Mid",
        "Final",
        "Practice",
      ],
      default: "Quiz",
    },

    duration: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    passMark: {
      type: Number,
      default: 50,
    },

    startTime: Date,

    endTime: Date,

    status: {
      type: String,
      enum: [
        "Draft",
        "Published",
        "Closed",
      ],
      default: "Draft",
    },

    shuffleQuestions: {
      type: Boolean,
      default: true,
    },

    shuffleOptions: {
      type: Boolean,
      default: true,
    },

    showResult: {
      type: Boolean,
      default: false,
    },
    instruction: {
  type: String,
  default: "",
},

allowReview: {
  type: Boolean,
  default: true,
},

allowNavigation: {
  type: Boolean,
  default: true,
},

negativeMarking: {
  type: Boolean,
  default: false,
},

negativeValue: {
  type: Number,
  default: 0,
},
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Exam",
  examSchema
);