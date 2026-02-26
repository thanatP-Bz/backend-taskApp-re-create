import { Schema, model } from "mongoose";
import { type ITask } from "../types/task.js";

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean },
    user: {
      ref: "User",
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

export const Task = model<ITask>("task", taskSchema);
