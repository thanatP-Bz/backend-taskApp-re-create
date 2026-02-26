import { Types } from "mongoose";

export interface ITask {
  title: string;
  description: string;
  isCompleted: boolean;
  user: Types.ObjectId;
}
