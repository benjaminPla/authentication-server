import mongoose from "mongoose";
import { IUser } from "./interfaces";
import "dotenv/config";

const userSchema: mongoose.Schema<IUser> = new mongoose.Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, required: true, default: 0 },
});

export const User = mongoose.model<IUser>("User", userSchema);

export const connectToMongoDB = async (connString: string | undefined) => {
  if (connString) {
    try {
      await mongoose.connect(connString);
      console.log("Successfully Connected to MongoDB");
    } catch (error) {
      console.log(
        `Internal Server Error While Connection to MongoDB: ${error}`
      );
      process.exit(1);
    }
  } else {
    console.log("MongoDB Connection String Not Fond");
    process.exit(1);
  }
};
