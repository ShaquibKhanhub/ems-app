import express from "express";
import {
  getAttendanceReport,
  getLeaveStats,
  getPayrollSummary,
  getTaskPerformance,
} from "../controllers/report.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

import { protect, isAdmin } from "../middleware/auth.middleware.js";
const router = express.Router();

// Admin-only: use both middleware
router.use(protect, isAdmin);

// 📅 Attendance report per employee
router.get("/attendance", getAttendanceReport);

// 📝 Leave stats
router.get("/leaves", getLeaveStats);

// 💰 Payroll summary
router.get("/payroll", getPayrollSummary);

// 📊 Task performance
router.get("/tasks", getTaskPerformance);

export default router;
