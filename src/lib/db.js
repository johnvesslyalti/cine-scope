import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Do NOT use `new` here:
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
