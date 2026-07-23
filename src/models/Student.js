import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
  type: String,
  required: true,
  unique: true,
  trim: true,
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
zone: String,
city: String,
Woreda: String,
SpecificPlace: String,
address: String,

phone: {
  type: String,
  trim: true,
},

email: {
  type: String,
  trim: true,
  lowercase: true,
},


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

COC: String,

COCIssueDate: Date,

level: {
  type: String,
  required: true,
},

semester: {
  type: String,
  required: true,
},
section: {
  type: String,
  required: true,
  default: "A",
},

batch: String,

studyMode: String,

enrollmentStatus: {
  type: String,
  enum: [
    "Enrolled",
    "Deferred",
    "Suspended",
    "Withdrawn",
    "Graduated",
    "Transfer"
  ],
  default: "Enrolled",
},
statusIssueDate: {
  type: Date,
},

statusRemark: {
  type: String,
  trim: true,
},

statusInstituteName: {
  type: String,
  trim: true,
},



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