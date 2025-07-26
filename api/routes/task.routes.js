import express from "express";
import {
  assignTask,
  getTasksByEmployee,
  updateTaskStatus,
  addTaskComment,
  getAllTasks,
} from "../controllers/task.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

import { isAdmin, protect } from "../middleware/auth.middleware.js";
const router = express.Router();

// 🔒 Secure all routes
router.use(protect);

// ✅ Assign a task (Admin)
router.post("/", isAdmin, assignTask);

// ✅ Get tasks for employee
router.get("/employee/:id", getTasksByEmployee);

// ✅ Update task status
router.patch("/:id/status", updateTaskStatus);

// ✅ Add comment to task
router.post("/:id/comments", addTaskComment);

// 👇 Admin-only route
router.get("/", isAdmin, getAllTasks); // ✅ Get all tasks

export default router;
