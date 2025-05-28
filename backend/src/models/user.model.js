import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimum length should be 6 characters"],
    },

    profilePic: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = mongoose.model("User", userSchema);
export default User;
