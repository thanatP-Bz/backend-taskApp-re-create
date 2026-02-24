import { IUserDocument } from "./user.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument | null;
    }
  }
}

export {};
