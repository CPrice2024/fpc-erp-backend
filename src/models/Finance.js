import mongoose from "mongoose";

const financeSchema =
  new mongoose.Schema(
    {
      student: {
        type:
          mongoose.Schema.Types
            .ObjectId,
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

      transactionId:
        String,

      slip: String,

      status: {
        type: String,
        default: "Completed",
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