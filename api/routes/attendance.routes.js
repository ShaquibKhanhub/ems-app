import express from "express";
import {
  clockIn,
  clockOut,
  getAttendanceByDate,
  getCalendarView,
  filterAttendance,
  markAttendance,
  getEmployeeAttendance,
  getAllAttendance,
} from "../controllers/attendance.controller.js";

import { protect, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔒 All routes below require authentication
router.use(protect);

// 👨‍💼 EMPLOYEE
router.post("/clock-in", clockIn); // POST /clock-in
router.post("/clock-out", clockOut); // POST /clock-out
router.get("/calendar/:id", getCalendarView); // GET /calendar/:id
router.get("/date/:id", getAttendanceByDate); // GET /date/:id?date=YYYY-MM-DD
router.get("/employee/:id", getEmployeeAttendance); // GET /employee/:id

// 🛡️ ADMIN
router.use(isAdmin);
router.post("/", markAttendance); // POST / (Admin mark attendance)
router.get("/", getAllAttendance); // GET /
router.get("/filter", filterAttendance); // GET /filter?date=...&role=...&type=...

export default router;
