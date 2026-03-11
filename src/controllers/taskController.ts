import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";
import type { IUserDocument } from "../types/user.js";
import { Task } from "../models/tasksModel.js";
import { ApiError } from "../utils/error/ApiError.js";
import mongoose from "mongoose";

const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, isCompleted } = req.body;
    const user = req.user as IUserDocument;

    const task = await Task.create({
      title,
      description,
      isCompleted: isCompleted,
      user: user!._id,
    });

    res.status(200).json({ task, message: "create task successfully" });
  },
);

const getTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserDocument;
    const tasks = await Task.find({ user: user!._id });

    res.status(200).json({ tasks });
  },
);

const getSingleTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user as IUserDocument;

    const task = await Task.findById({ _id: id, userId });

    res.status(200).json({ task });
  },
);

const updateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user as IUserDocument;

    const task = await Task.findOne({ _id: id, user: user!._id });

    if (!task) {
      throw new ApiError(400, "task not found");
    }

    const { title, description, isCompleted } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;

    const updatedTask = await task.save();

    res.status(200).json({ updatedTask, message: "Update task successfully!" });
  },
);

const deleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      throw new ApiError(404, "task not found");
    }

    const task = await Task.findOneAndDelete({ _id: id });

    if (!task) {
      throw new ApiError(404, "task not found");
    }

    res.status(200).json({ message: "task deleted" });
  },
);

export { getTask, createTask, getSingleTask, updateTask, deleteTask };
