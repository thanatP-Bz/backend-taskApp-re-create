import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
import passport from "./config/passport.js";
import express, { type Request, type Response } from "express";
import connectDB from "./config/connectDB.js";
import { errorHandler } from "./middleware/error/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import oauthRoute from "./routes/oauthRoute.js";
import refreshTokenRoute from "./routes/refreshTokenRoute.js";
import redis from "./config/connectRedis.js";

const app = express();
app.use(express.json());

//passport.js
app.use(passport.initialize());

//routes
app.use("/api/auth", authRoutes, oauthRoute);
app.use("/api/task", taskRoutes);
app.use("/api/token", refreshTokenRoute);

app.get("/", (req: Request, res: Response) => {
  res.json("connect to backend");
});

//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

const serverStart = async () => {
  //connect to Redis
  await redis.connect();

  //connect to DB
  await connectDB(MONGO_URI);

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

serverStart();
