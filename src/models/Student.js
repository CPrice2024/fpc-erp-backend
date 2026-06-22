import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
    },

    // Personal Information
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

    dob: Date,

    nationality: {
      type: String,
      default: "Ethiopian",
    },


    phone: String,

    email: String,

    photo: {
  type: String,
  default: "",
},

    region: String,

    city: String,

    address: String,

    // Education
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    batch: String,

    academicYear: String,

    admissionYear: {
      type: Number,
      default: new Date().getFullYear(),
    },

    // Guardian
    guardianName: String,

    guardianPhone: String,

    relationship: String,

    // Status
    status: {
      type: String,
      enum: [
        "active",
        "graduated",
        "suspended",
        "withdrawn",
      ],
      default: "active",
    },

    // Tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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