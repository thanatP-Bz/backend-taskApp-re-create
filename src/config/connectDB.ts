import mongoose from "mongoose";

const connectDB = async (mongoURI: string) => {
  try {
    await mongoose.connect(mongoURI);
    console.log(`connect to database..`);
  } catch (error) {
    console.error("failed to connect to database", error);
    process.exit(1);
  }
};

export default connectDB;
