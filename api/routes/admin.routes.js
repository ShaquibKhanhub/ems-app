// routes/admin.routes.js
import express from "express";
import {
  setRole,
  getDashboardStats,
  deleteUserAndEmployee,
} from "../controllers/admin.controller.js";
import { protect, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// 👑 Admin-only actions
router.patch("/set-role", protect, isAdmin, setRole); // promote/demote
router.get("/dashboard", protect, isAdmin, getDashboardStats); // admin dashboard stats

router.delete("/:id", protect, isAdmin, deleteUserAndEmployee);
export default router;
