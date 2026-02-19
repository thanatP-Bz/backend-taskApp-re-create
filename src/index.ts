import dotenv from "dotenv";
dotenv.config();
import express, { type Request, type Response } from "express";
import connectDB from "./config/connectDB.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.json("connect to backend");
});

app.listen(PORT, () => {
  console.log(`server connected, app listen to the port ${PORT}`);
});

const MONGODB_URI = process.env.MONGODB_URI as string;

const serverStart = async () => {
  await connectDB(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

serverStart();
