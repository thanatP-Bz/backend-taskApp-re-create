import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";

const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("create Task");
  },
);

const getTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("get Task");
  },
);

const getSingleTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("get single Task");
  },
);

const editTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("edit Task");
  },
);

const deleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("delete Task");
  },
);

export { getTask, createTask, getSingleTask, editTask, deleteTask };
