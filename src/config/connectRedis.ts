import { createClient } from "redis";

const socketConfig =
  process.env.NODE_ENV === "production"
    ? { tls: true as const, rejectUnauthorized: false }
    : {};

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: socketConfig,
});

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;
