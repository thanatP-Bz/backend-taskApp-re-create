import express from "express";
import {
  getTask,
  createTask,
  getSingleTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { authenticate } from "../middleware/authentication/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createTask);
router.get("/", getTask);
router.get("/:id", getSingleTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
