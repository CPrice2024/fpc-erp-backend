import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log("TOKEN RECEIVED:", token);

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      console.log("DECODED:", decoded);

      const user = await User.findById(
        decoded.id
      ).select("-password");

      console.log("USER FOUND:", user);

      console.log("REQ USER:", {
        id: user?._id,
        role: user?.role,
        department: user?.department,
      });

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      req.user = {
        id: user._id,
        role: user.role,
        department: user.department,
      };

      next();
    } catch (error) {
      console.log("JWT ERROR:", error);

      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({
      message: "No token provided",
    });
  }
};