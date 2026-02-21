import { IUserDocument } from "./user.ts";

declare global {
  namespace express {
    interface Request {
      user?: IUserDocument | null;
    }
  }
}

export {};
