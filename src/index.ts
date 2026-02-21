import dotenv from "dotenv";
dotenv.config();
import express, { type Request, type Response } from "express";
import connectDB from "./config/connectDB.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json("connect to backend");
});

//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;

const serverStart = async () => {
  await connectDB(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

serverStart();
