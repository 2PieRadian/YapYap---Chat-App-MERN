import mongoose from "mongoose";

export const connectDB = async (callback) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    callback();
  } catch (err) {
    console.log("MongoDB connection error: ", err);
    callback(err);
  }
};
