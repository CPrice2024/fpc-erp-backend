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



    photo: {
  type: String,
  default: "",
},
region: String,
city: String,
Woreda: String,
SpecificPlace: String,
address: String,

phone: String,
email: String,


  // =========================
// Education Information
// =========================

institutionName: String,

academicYear: String,

educationType: String,

highestQualification: String,

previousInstitution: String,

previousEducation: String,

department: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Department",
  required: true,
},
courses: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
],

program: String,

major: String,

level: {
  type: String,
  required: true,
},

semester: String,

batch: String,

studyMode: String,

enrollmentStatus: String,

educationSponsor: String,

educationLanguage: String,

registrationDate: Date,

educationStartDate: Date,

educationEndDate: Date,

durationMonths: Number,

admissionYear: {
  type: Number,
  default: new Date().getFullYear(),
},


    // Guardian Information
    guardianName: String,

    guardianPhone: String,

    relationship: String,

    // =========================
// Inmate Information
// =========================

isInmate: {
  type: Boolean,
  default: false,
},

prisonId: String,

crimeType: String,

sentenceDuration: Number,

securityLevel: String,

prisonFacility: String,

cellNumber: String,

imprisonmentStartDate: Date,

expectedReleaseDate: Date,

paroleDate: Date,

currentStatus: String,

assignedOfficer: String,

officerPhone: String,

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