import bcrypt from "bcrypt";

import { createToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

function handleErrors(err) {
  let errors = {};

  // If the 'error' was due to invalidation of 'email' or 'pass'
  if (err.name == "ValidationError") {
    const errorKeys = Object.values(err.errors);

    errorKeys.forEach((error) => {
      errors[error.properties.path] = error.properties.message;
    });
  }

  return errors;
}

export const signup_post = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // If email already exists
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ message: "That email is already registered" });
    }

    // Create the user
    const user = await User.create({ fullName, email, password });

    // After the user has been created send the ID created by MongoDB to create the JWT Token
    createToken(user._id, res);

    res.status(201).json(user);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

export const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    createToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout_post = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Error in logout controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("Error in update-profile", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.log("Error in checkAuth controller: ", err.message);
    res.status(500).json({ message: "Internal server errror" });
  }
};
