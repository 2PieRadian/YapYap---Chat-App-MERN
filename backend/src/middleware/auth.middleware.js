import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    // Token found - Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Valid Token - Get the user from the DB, excluding the password
    const user = await User.findById(decoded.user_id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Add the user to the request
    next();
  } catch (err) {
    console.log("Error in authenticateJWT method: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
