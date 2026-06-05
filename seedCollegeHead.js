import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./src/models/User.js";

// CONNECT DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// CREATE COLLEGE HEAD
const createCollegeHead = async () => {
  try {

    // CHECK IF USER EXISTS
    const existingUser =
      await User.findOne({
        email: "head@test.com",
      });

    if (existingUser) {
      console.log(
        "College Head already exists"
      );

      process.exit();
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash("123456", 10);

    // CREATE USER
    const user = await User.create({
      name: "Main College Head",

      email: "head@test.com",

      password: hashedPassword,

      role: "college_head",
    });

    console.log(
      "College Head Created Successfully"
    );

    console.log(user);

    process.exit();

  } catch (err) {
    console.log(err);

    process.exit();
  }
};

createCollegeHead();