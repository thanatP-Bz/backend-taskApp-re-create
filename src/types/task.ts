import { Types } from "mongoose";

export interface ITask {
  title: string;
  description: string;
  completed: boolean;
  user: Types.ObjectId;
}
