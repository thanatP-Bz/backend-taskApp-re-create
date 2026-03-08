import { IUserDocument } from "./user.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument | null;
      rateLimit?: {
        limit: number;
        remaining: number;
        window: number;
      };
    }
  }
}

export {};
