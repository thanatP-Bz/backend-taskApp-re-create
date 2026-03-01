import redis from "../config/connectRedis.js";
import type { SessionData, CreateSessionInput } from "../types/redisSession.js";
import crypto from "crypto";
import { ApiError } from "../utils/error/ApiError.js";

//generate sessionId
const generateSessionId = (): string => {
  return crypto.randomUUID();
};

//create session when user login
export const createSession = async (
  input: CreateSessionInput,
): Promise<string> => {
  const { userId, ipAddress, userAgent } = input;

  const sessionId = generateSessionId();
  const sessionKey = `session:${sessionId}`;

  const sessionData: SessionData = {
    userId: userId.toString(),
    ipAddress,
    userAgent,
    loginTime: new Date().toISOString(),
    lastActivitity: new Date().toISOString(),
    isActive: true,
  };
  //store in Redis
  const expirationSeconds = 7 * 24 * 60 * 60;
  await redis.setEx(sessionKey, expirationSeconds, JSON.stringify(sessionData));

  return sessionId;
};

//check is session is valid
export const isSessionValid = async (sessionId: string): Promise<boolean> => {
  const sessionKey = `session:${sessionId}`;

  const sessionDataString = await redis.get(sessionKey);

  if (!sessionDataString) {
    console.log("no session id");
    return false;
  }

  const sessionData: SessionData = JSON.parse(sessionDataString);

  if (!sessionData.isActive) {
    throw new ApiError(401, "session is not active");
  }

  return true;
};

//update session activities (log in)
export const updateSessionActivity = async (
  sessionId: string,
): Promise<void> => {
  const sessionKey = `session:${sessionId}`;

  const sessionDataString = await redis.get(sessionKey);

  if (!sessionDataString) {
    console.log(`session ${sessionId} not found`);
    return;
  }

  const sessionData: SessionData = JSON.parse(sessionDataString);

  //update last activity
  sessionData.lastActivitity = new Date().toString();

  //get remain time to live ttl
  const ttl = await redis.ttl(sessionKey);

  await redis.setEx(sessionKey, ttl, JSON.stringify(sessionData));
};

//get all active sessions for a user (for UI)
export const getUserActiveSessions = async (
  userId: string,
): Promise<SessionData[]> => {
  const keys = await redis.keys("session:*");

  const sessions: SessionData[] = [];

  for (const key of keys) {
    const sessionDataString = await redis.get(key);

    if (sessionDataString) {
      const sessionData: SessionData = JSON.parse(sessionDataString);

      if (sessionData.userId === userId && sessionData.isActive) {
        sessions.push(sessionData);
      }
    }
  }
  return sessions.sort(
    (a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime(),
  );
};

//deactivate session(log out)
export const deactivateSession = async (sessionId: string) => {
  const sessionKey = `session:${sessionId}`;

  await redis.del(sessionKey);

  console.log(`session deactivate, ${sessionId}`);
};
