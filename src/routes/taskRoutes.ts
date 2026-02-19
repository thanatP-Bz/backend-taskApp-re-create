import express from "express";
import {
  getTask,
  createTask,
  getSingleTask,
  editTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTask);
router.get("/:id", getSingleTask);
router.patch("/:id", editTask);
router.delete("/:id", deleteTask);

export default router;
