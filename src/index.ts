import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
import cors from "cors";
import passport from "./config/passport.js";
import express, { type Request, type Response } from "express";
import connectDB from "./config/connectDB.js";
import { errorHandler } from "./middleware/error/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import oauthRoute from "./routes/oauthRoute.js";
import refreshTokenRoute from "./routes/refreshTokenRoute.js";
import twoFactorsRoutes from "./routes/2FARoutes.js";
import redis from "./config/connectRedis.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://frontend-taskapp-re-create.onrender.com/",
    credentials: true,
  }),
);

//passport.js
app.use(passport.initialize());

//routes
app.use("/api/auth", authRoutes, oauthRoute);
app.use("/api/task", taskRoutes);
app.use("/api/token", refreshTokenRoute);
app.use("/api/2fa", twoFactorsRoutes);
app.get("/", (req: Request, res: Response) => {
  res.json("connect to backend");
});
// Add this before your error handler
app.get("/debug/ratelimit/:action", async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const action = req.params.action;
  const key = `ratelimit:${action}:${ip}`;

  const attempts = await redis.get(key);
  const ttl = await redis.ttl(key);

  res.json({
    action,
    ip,
    key,
    currentAttempts: attempts ? parseInt(attempts) : 0,
    ttl,
    expiresIn: ttl > 0 ? `${ttl} seconds` : "expired or not set",
    maxAllowed: action === "login" ? 5 : action === "register" ? 3 : "unknown",
  });
});
//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

const serverStart = async () => {
  //connect to DB
  await connectDB(MONGO_URI);

  // Redis connection (ioredis connects automatically)
  redis.on("connect", () => {
    console.log("✅ Redis connected");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis error:", err);
  });

  redis.on("ready", () => {
    console.log("✅ Redis is ready to use");
  });

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

serverStart();
