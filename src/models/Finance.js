import mongoose from "mongoose";

const financeSchema =
  new mongoose.Schema(
    {
      student: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },

      paymentType: {
        type: String,
        enum: [
          "Paid",
          "Funded",
        ],
        required: true,
      },

      paymentMethod: {
        type: String,
        enum: [
          "Cash",
          "Bank",
          "Telebirr",
          "CBE Birr",
        ],
      },

      amount: {
        type: Number,
        default: 0,
      },

      // NEW
      semester: {
        type: String,
      },

      academicYear: {
        type: String,
      },

      receiptNumber: {
        type: String,
        unique: true,
      },

      transactionId: String,

      slip: String,

      paidBy: {
        type: String,
      },

      paidDate: {
        type: Date,
        default: Date.now,
      },

      remarks: {
        type: String,
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Completed",
          "Rejected",
        ],
        default: "Completed",
      },
      semester: String,
academicYear: String,

receiptNumber: {
  type: String,
  unique: true,
},

paidBy: String,

paidDate: {
  type: Date,
  default: Date.now,
},

remarks: String,

createdBy: {
  type:
    mongoose.Schema.Types.ObjectId,
  ref: "User",
},
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Finance",
  financeSchema
);