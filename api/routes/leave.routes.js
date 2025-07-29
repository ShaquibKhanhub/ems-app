import express from "express";
import {
  applyLeave,
  getEmployeeLeaves,
  approveLeave,
  rejectLeave,
  getAllLeaves,
} from "../controllers/leave.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

import { isAdmin, protect } from "../middleware/auth.middleware.js";
const router = express.Router();

// ✅ Apply for leave (employee)
router.post("/", protect, applyLeave); // 👤 Employee apply
router.get("/", protect, isAdmin, getAllLeaves);
router.get("/:id", protect, getEmployeeLeaves); // 👤 Employee view own


// ✅ Admin-only actions
router.patch("/:id/approve", protect, isAdmin, approveLeave);
router.patch("/:id/reject", protect, isAdmin, rejectLeave);

export default router;
